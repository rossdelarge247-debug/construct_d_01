/**
 * Source-content boolean assertions for copy-flip tests.
 *
 * Avoids `.toContain` on large source strings — its failure output dumps
 * the entire file. Wrapping `.includes()` in a boolean returns a clean
 * `expected true to be false` on failure.
 *
 * Lifted from the inline pattern in `tests/unit/confirmation-questions-copy.test.ts`
 * (S-B-1) on its second use (S-B-2). HANDOFF-30 candidate #4.
 */
export interface SourceAssertions {
  has: (needle: string) => boolean
  lacks: (needle: string) => boolean
  matches: (pattern: RegExp) => RegExpMatchArray[]
}

export function makeSourceAssertions(source: string): SourceAssertions {
  return {
    has: (needle) => source.includes(needle),
    lacks: (needle) => !source.includes(needle),
    matches: (pattern) => Array.from(source.matchAll(pattern)),
  }
}
