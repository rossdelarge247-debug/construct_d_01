import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, existsSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const HOOK = resolve(__dirname, "../../.claude/hooks/line-count.sh");

function sh(cmd: string, cwd: string): string {
  return execSync(cmd, { cwd, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

function runHook(cwd: string, input: object): { systemMessage: string; additionalContext: string } {
  const out = execSync(`bash ${HOOK}`, {
    cwd,
    input: JSON.stringify(input),
    stdio: ["pipe", "pipe", "pipe"],
  }).toString();
  if (!out.trim()) return { systemMessage: "", additionalContext: "" };
  const parsed = JSON.parse(out);
  return {
    systemMessage: parsed.systemMessage ?? "",
    additionalContext: parsed.hookSpecificOutput?.additionalContext ?? "",
  };
}

interface RepoFixture {
  workdir: string;
  baseSha: string;
  cleanup: () => void;
}

function makeRepo({ commitsAfterBase = 0, linesPerCommit = 5 } = {}): RepoFixture {
  const root = mkdtempSync(join(tmpdir(), "hooks-line-count-"));
  const origin = join(root, "origin.git");
  const work = join(root, "work");

  execSync(`git init --bare --initial-branch=main ${origin}`, { stdio: "ignore" });
  execSync(`git clone ${origin} ${work}`, { stdio: "ignore" });

  sh(`git config user.email test@example.com`, work);
  sh(`git config user.name Tester`, work);
  // Disable signing in the throwaway test fixture only — env-runner's code-sign
  // wrapper fails on synthetic commits with "missing source". This config is
  // local to the temp clone and never touches the project repo.
  sh(`git config commit.gpgsign false`, work);
  sh(`git config tag.gpgsign false`, work);

  // Initial commit on main
  writeFileSync(join(work, "README.md"), "init\n");
  sh(`git add .`, work);
  sh(`git commit -m initial`, work);
  sh(`git push origin main`, work);

  const baseSha = sh(`git rev-parse HEAD`, work);

  // Optionally add commits AFTER the base — simulating prior-session work
  // already on the branch when this session starts.
  for (let i = 0; i < commitsAfterBase; i++) {
    const lines = Array.from({ length: linesPerCommit }, (_, j) => `inherited line ${i}-${j}`).join("\n");
    writeFileSync(join(work, `inherited-${i}.txt`), lines + "\n");
    sh(`git add .`, work);
    sh(`git commit -m inherited-${i}`, work);
  }

  return {
    workdir: work,
    baseSha,
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

describe("line-count.sh — session-base SHA measurement", () => {
  let fixture: RepoFixture;
  const sessionId = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const stateFile = `/tmp/claude-lines-${sessionId}.txt`;
  const baseFile = `/tmp/claude-base-${sessionId}.txt`;

  beforeEach(() => {
    fixture = makeRepo({ commitsAfterBase: 3, linesPerCommit: 10 });
  });

  afterEach(() => {
    fixture.cleanup();
    if (existsSync(stateFile)) unlinkSync(stateFile);
    if (existsSync(baseFile)) unlinkSync(baseFile);
  });

  it("AC-3a: when session-base file exists with a valid SHA, diffs against base (NOT origin/main)", () => {
    // Capture HEAD AFTER the inherited commits — this represents the session-start moment
    const sessionBaseSha = sh(`git rev-parse HEAD`, fixture.workdir);
    writeFileSync(baseFile, sessionBaseSha + "\n");

    // Now add a working-tree change (simulating session-authored work)
    writeFileSync(join(fixture.workdir, "session-work.txt"), "a\nb\nc\n");

    const { systemMessage } = runHook(fixture.workdir, { tool_name: "Edit", session_id: sessionId });

    // The diff vs session-base should report only the session-authored 3 lines (not the 30 inherited).
    // Untracked file → 3 lines reported as "untracked" (not in tracked add/delete).
    expect(systemMessage).toMatch(/\+3 untracked/);
    // And the inherited 30 lines must NOT inflate the count
    expect(systemMessage).not.toMatch(/\+30/);
    expect(systemMessage).toMatch(/3 session churn/);
  });

  it("AC-3b: when session-base file is absent, falls back to origin/main diff (preserves prior behaviour)", () => {
    // No base file written → fallback path
    expect(existsSync(baseFile)).toBe(false);

    // Same fixture: 3 inherited commits = 30 lines vs origin/main
    const { systemMessage } = runHook(fixture.workdir, { tool_name: "Edit", session_id: sessionId });

    // Should report the inherited 30 lines (proves fallback engages)
    expect(systemMessage).toMatch(/\+30/);
    expect(systemMessage).toMatch(/30 session churn/);
  });

  it("AC-3c: when session-base file contains an unreachable SHA, falls back gracefully (no crash, no error)", () => {
    writeFileSync(baseFile, "deadbeef0000000000000000000000000000beef\n");

    const { systemMessage } = runHook(fixture.workdir, { tool_name: "Edit", session_id: sessionId });

    // Falls back to origin/main → reports the inherited 30 lines
    expect(systemMessage).toMatch(/30 session churn/);
    // No bash error noise leaked into the user-facing message
    expect(systemMessage).not.toMatch(/fatal:|error:|bad revision/i);
  });

  it("preserves existing contract: ignores non-Write/Edit tool calls", () => {
    const out = execSync(`bash ${HOOK}`, {
      cwd: fixture.workdir,
      input: JSON.stringify({ tool_name: "Read", session_id: sessionId }),
      stdio: ["pipe", "pipe", "pipe"],
    }).toString();
    expect(out.trim()).toBe("");
  });
});
