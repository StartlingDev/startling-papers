import { describe, expect, it } from 'vitest';
import { resolveTemplateConfig } from '@/composables/usePaperConfig';

describe('resolveTemplateConfig', () => {
  it('converts authored preset measurements into the active unit', () => {
    const template = resolveTemplateConfig(
      {
        unit: 'cm',
        cellSize: 0.5,
        dotSize: 0.05,
        strokeWidth: 0.02,
      },
      'mm',
    );

    expect(template.unit).toBe('mm');
    expect(template.cellSize).toBeCloseTo(5);
    expect(template.dotSize).toBeCloseTo(0.5);
    expect(template.strokeWidth).toBeCloseTo(0.2);
  });

  it('falls back to default template units when none are specified', () => {
    const template = resolveTemplateConfig(
      {
        gridType: 'horizontal-lines',
        cellSize: 0.8,
      },
      'mm',
    );

    expect(template.unit).toBe('mm');
    expect(template.cellSize).toBeCloseTo(8);
  });
});
