import { describe, it, expect } from 'vitest';
import { SCREENS } from '../types';

describe('types', () => {
  it('SCREENS contains all expected screen values', () => {
    expect(SCREENS).toContain('home');
    expect(SCREENS).toContain('churches');
    expect(SCREENS).toContain('ai-exam');
    expect(SCREENS).toContain('schedule');
    expect(SCREENS).toContain('confession');
  });

  it('SCREENS has exactly 5 entries', () => {
    expect(SCREENS).toHaveLength(5);
  });
});
