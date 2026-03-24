import { describe, expect, it } from 'vitest';
import { resolvePageSize } from '@/models/paperFormats';

describe('page format resolution', () => {
  it('returns portrait dimensions by default', () => {
    expect(resolvePageSize('A4')).toEqual({
      widthMm: 210,
      heightMm: 297,
    });
  });

  it('swaps width and height for landscape pages', () => {
    expect(resolvePageSize('Letter', true)).toEqual({
      widthMm: 279.4,
      heightMm: 215.9,
    });
  });
});
