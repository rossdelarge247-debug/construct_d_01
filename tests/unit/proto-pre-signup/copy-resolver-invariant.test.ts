import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SCREENS_DIR = resolve(
  process.cwd(),
  'src/app/dev/proto/pre-signup-interview/screens',
);

const SCREEN_FILES = ['O1.tsx', 'O2.tsx', 'O3.tsx', 'O4.tsx', 'O5.tsx', 'O6.tsx', 'O7.tsx', 'O8.tsx'];

const ATTR_NAMES = ['eyebrow', 'heading', 'helper', 'title', 'caption', 'aria-label', 'ctaLabel', 'sub', 'placeholder'];

const ATTR_DOUBLE_REGEX = new RegExp(
  `\\b(${ATTR_NAMES.join('|')})\\s*=\\s*"[A-Z][^"]+"`,
  'g',
);
const ATTR_SINGLE_REGEX = new RegExp(
  `\\b(${ATTR_NAMES.join('|')})\\s*=\\s*'[A-Z][^']+'`,
  'g',
);

const JSX_TEXT_CAPITAL_REGEX = /(?<=>)[A-Z][a-zA-Z][a-zA-Z'.,!?: \-]+(?=<)/g;
const JSX_TEXT_LOWERCASE_REGEX = /(?<=>)[a-z]+\s[a-z]+\s[a-z]+[a-zA-Z'.,!?: \-]*(?=<)/g;

const ALLOWLIST_SUBSTRINGS: ReadonlyArray<{ file: string; match: string; reason: string }> = [];

function findLine(content: string, matchIndex: number): number {
  return content.slice(0, matchIndex).split('\n').length;
}

type Hit = { file: string; line: number; match: string; family: string };

function scan(file: string): ReadonlyArray<Hit> {
  const content = readFileSync(resolve(SCREENS_DIR, file), 'utf8');
  const hits: Hit[] = [];
  for (const re of [ATTR_DOUBLE_REGEX, ATTR_SINGLE_REGEX]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      hits.push({ file, line: findLine(content, m.index), match: m[0], family: 'attribute' });
    }
  }
  for (const re of [JSX_TEXT_CAPITAL_REGEX, JSX_TEXT_LOWERCASE_REGEX]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      hits.push({ file, line: findLine(content, m.index), match: m[0], family: 'jsx-text' });
    }
  }
  return hits.filter(
    (h) => !ALLOWLIST_SUBSTRINGS.some((a) => a.file === h.file && h.match.includes(a.match)),
  );
}

describe('copy-resolver invariant: no hardcoded user-facing strings in screens', () => {
  for (const file of SCREEN_FILES) {
    it(`${file} routes all user-facing copy through a resolver`, () => {
      const hits = scan(file);
      if (hits.length > 0) {
        const report = hits.map((h) => `  ${h.file}:${h.line} (${h.family}) ${h.match}`).join('\n');
        throw new Error(`Hardcoded user-facing string(s) found:\n${report}`);
      }
      expect(hits).toEqual([]);
    });
  }
});
