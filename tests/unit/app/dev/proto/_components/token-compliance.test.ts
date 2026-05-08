import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

describe('components use only --ds-* tokens (no hex / rgb / inline px)', () => {
  const componentDir = join(process.cwd(), 'src/app/dev/proto/_components');
  const files = readdirSync(componentDir).filter((f) => f.endsWith('.tsx'));

  it('locates at least one component file', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    describe(file, () => {
      const content = readFileSync(join(componentDir, file), 'utf8');

      it('contains no hardcoded hex colors', () => {
        const matches = content.match(/#[0-9a-fA-F]{3,8}\b/g);
        expect(matches, `hex colors found in ${file}: ${matches?.join(', ')}`).toBeNull();
      });

      it('contains no rgb() or rgba() calls', () => {
        expect(content).not.toMatch(/\brgba?\s*\(/);
      });

      it('contains no raw px in margin/padding/gap CSS properties', () => {
        const spacingPxRegex = /(margin|padding|gap)[a-zA-Z-]*\s*:\s*['"`]?[^'"`,}]*\d+\s*px/g;
        const matches = content.match(spacingPxRegex);
        expect(matches, `spacing-px found in ${file}: ${matches?.join(', ')}`).toBeNull();
      });
    });
  }
});
