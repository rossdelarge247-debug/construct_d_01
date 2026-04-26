import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, existsSync, unlinkSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const HOOK = resolve(__dirname, "../../.claude/hooks/session-start.sh");

function sh(cmd: string, cwd: string): string {
  return execSync(cmd, { cwd, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
}

function runHook(cwd: string, input: object): { systemMessage: string; additionalContext: string } {
  const out = execSync(`bash ${HOOK}`, {
    cwd,
    input: JSON.stringify(input),
    stdio: ["pipe", "pipe", "pipe"],
  }).toString();
  const parsed = JSON.parse(out);
  return {
    systemMessage: parsed.systemMessage ?? "",
    additionalContext: parsed.hookSpecificOutput?.additionalContext ?? "",
  };
}

interface RepoFixture {
  workdir: string;
  cleanup: () => void;
}

function makeRepo({
  branch = "main",
  remoteBranches = [] as string[],
}: {
  branch?: string;
  remoteBranches?: string[];
} = {}): RepoFixture {
  const root = mkdtempSync(join(tmpdir(), "hooks-session-start-"));
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

  writeFileSync(join(work, "README.md"), "init\n");
  sh(`git add .`, work);
  sh(`git commit -m initial`, work);
  sh(`git push origin main`, work);

  // Create requested branches on origin (simulating canonical branches that already exist)
  for (const rb of remoteBranches) {
    sh(`git checkout -b ${rb}`, work);
    writeFileSync(join(work, `${rb.replace(/[^a-z0-9]/gi, "-")}.txt`), "x\n");
    sh(`git add .`, work);
    sh(`git commit -m ${rb}`, work);
    sh(`git push origin ${rb}`, work);
    sh(`git checkout main`, work);
  }

  // Land on the target branch (suffixed orphan, canonical, etc.)
  if (branch !== "main") {
    sh(`git checkout -b ${branch}`, work);
  }

  return {
    workdir: work,
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

describe("session-start.sh — session-base SHA capture (AC-1)", () => {
  let fixture: RepoFixture;
  const sessionId = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const baseFile = `/tmp/claude-base-${sessionId}.txt`;

  beforeEach(() => {
    fixture = makeRepo({ branch: "claude/canonical-slice" });
    if (existsSync(baseFile)) unlinkSync(baseFile);
  });

  afterEach(() => {
    fixture.cleanup();
    if (existsSync(baseFile)) unlinkSync(baseFile);
  });

  it("writes session-base file containing current HEAD SHA on first invocation", () => {
    runHook(fixture.workdir, { session_id: sessionId, source: "startup" });

    expect(existsSync(baseFile)).toBe(true);
    const written = readFileSync(baseFile, "utf-8").trim();
    const expected = sh(`git rev-parse HEAD`, fixture.workdir);
    expect(written).toBe(expected);
  });

  it("preserves existing base file across resume / clear re-invocations within same session_id", () => {
    runHook(fixture.workdir, { session_id: sessionId, source: "startup" });
    const firstSha = readFileSync(baseFile, "utf-8").trim();

    // Advance HEAD — second invocation must NOT overwrite
    writeFileSync(join(fixture.workdir, "advance.txt"), "x\n");
    sh(`git add .`, fixture.workdir);
    sh(`git commit -m advance`, fixture.workdir);

    runHook(fixture.workdir, { session_id: sessionId, source: "resume" });
    const secondSha = readFileSync(baseFile, "utf-8").trim();

    expect(secondSha).toBe(firstSha);
    // Sanity: HEAD really did move
    expect(sh(`git rev-parse HEAD`, fixture.workdir)).not.toBe(firstSha);
  });
});

describe("session-start.sh — suffix-orphan detection (AC-2)", () => {
  let fixture: RepoFixture;
  const sessionId = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const baseFile = `/tmp/claude-base-${sessionId}.txt`;

  afterEach(() => {
    fixture?.cleanup();
    if (existsSync(baseFile)) unlinkSync(baseFile);
  });

  it("AC-2a: suffixed branch + canonical exists on origin → warning surfaces with resync recipe", () => {
    fixture = makeRepo({
      branch: "claude/my-slice-AbCdE",
      remoteBranches: ["claude/my-slice"],
    });

    const { additionalContext } = runHook(fixture.workdir, { session_id: sessionId, source: "startup" });

    expect(additionalContext).toMatch(/Branch-resume check/i);
    expect(additionalContext).toMatch(/git fetch origin claude\/my-slice/);
    expect(additionalContext).toMatch(/git checkout -B claude\/my-slice origin\/claude\/my-slice/);
    expect(additionalContext).toMatch(/git branch -D claude\/my-slice-AbCdE/);
  });

  it("AC-2b: suffixed branch + canonical absent on origin → no warning", () => {
    fixture = makeRepo({
      branch: "claude/lonely-suffixed-Zz9q1",
      remoteBranches: [], // no canonical on origin
    });

    const { additionalContext } = runHook(fixture.workdir, { session_id: sessionId, source: "startup" });

    expect(additionalContext).not.toMatch(/Branch-resume check/i);
  });

  it("AC-2c: non-suffixed branch → no warning regardless of remote state", () => {
    fixture = makeRepo({
      branch: "claude/canonical-name",
      remoteBranches: ["claude/canonical-name-extra"],
    });

    const { additionalContext } = runHook(fixture.workdir, { session_id: sessionId, source: "startup" });

    expect(additionalContext).not.toMatch(/Branch-resume check/i);
  });

  it("AC-2d: off-pattern suffix length (4 chars) → no warning", () => {
    fixture = makeRepo({
      branch: "claude/short-suffix-abcd",
      remoteBranches: ["claude/short-suffix"],
    });

    const { additionalContext } = runHook(fixture.workdir, { session_id: sessionId, source: "startup" });

    expect(additionalContext).not.toMatch(/Branch-resume check/i);
  });

  it("AC-2d: off-pattern suffix length (6 chars) → no warning", () => {
    fixture = makeRepo({
      branch: "claude/long-suffix-abcdef",
      remoteBranches: ["claude/long-suffix"],
    });

    const { additionalContext } = runHook(fixture.workdir, { session_id: sessionId, source: "startup" });

    expect(additionalContext).not.toMatch(/Branch-resume check/i);
  });
});
