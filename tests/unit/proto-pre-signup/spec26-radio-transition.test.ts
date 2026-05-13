import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SCREENS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const moduleCssPath = (n: number) =>
  resolve(
    process.cwd(),
    `src/app/dev/proto/pre-signup-interview/screens/O${n}.module.css`,
  );

describe('spec 26 §5: background-color transition is 150ms ease across O1-O8', () => {
  it.each(SCREENS)(
    'O%d.module.css contains no background-color transition off the 150ms ease spec',
    (n) => {
      const css = readFileSync(moduleCssPath(n), 'utf-8');
      const matches = css.match(/background-color\s+\d+ms\s+ease(-out|-in)?/g) ?? [];
      const offSpec = matches.filter((m) => m.replace(/\s+/g, ' ') !== 'background-color 150ms ease');
      expect(offSpec).toEqual([]);
    },
  );
});
