import { describe, test, expect } from 'vitest';
import { APP_NAME, WORDMARK } from '@/constants';

describe('constants', () => {
  test('WORDMARK ends with a full stop', () => {
    expect(WORDMARK).toBe('Decouple.');
  });

  test('APP_NAME has no trailing punctuation', () => {
    expect(APP_NAME).toBe('Decouple');
  });
});
