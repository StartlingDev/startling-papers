import { describe, expect, it } from 'vitest';
import {
  createRect,
  generateParallelLineSegments,
  getHexMetrics,
  insetRect,
  resolveMargins,
  splitPatternArea,
} from '@/utils/geometry';

describe('geometry helpers', () => {
  it('resolves margin presets consistently', () => {
    expect(resolveMargins('regular')).toEqual({
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    });
  });

  it('insets rectangles by the provided margins', () => {
    expect(
      insetRect(
        createRect(0, 0, 210, 297),
        { top: 10, right: 12, bottom: 10, left: 12 },
      ),
    ).toEqual({
      x: 12,
      y: 10,
      width: 186,
      height: 277,
    });
  });

  it('splits heading and pattern areas with a fixed gap', () => {
    const content = createRect(10, 10, 190, 277);
    const result = splitPatternArea(content, 20);

    expect(result.headingArea).toEqual({
      x: 10,
      y: 10,
      width: 190,
      height: 20,
    });
    expect(result.patternArea).toEqual({
      x: 10,
      y: 34,
      width: 190,
      height: 253,
    });
  });

  it('returns flat-top hex metrics', () => {
    const metrics = getHexMetrics(5);

    expect(metrics.widthMm).toBeCloseTo(10);
    expect(metrics.heightMm).toBeCloseTo(8.660254);
    expect(metrics.horizontalStepMm).toBeCloseTo(7.5);
    expect(metrics.verticalStepMm).toBeCloseTo(8.660254);
  });

  it('clips horizontal line families to the target rectangle', () => {
    const segments = generateParallelLineSegments(createRect(0, 0, 10, 10), 0, 5);

    expect(segments).toHaveLength(3);
    expect(segments[0]).toEqual({ x1: 0, y1: 0, x2: 10, y2: 0 });
    expect(segments[1]).toEqual({ x1: 0, y1: 5, x2: 10, y2: 5 });
    expect(segments[2]).toEqual({ x1: 0, y1: 10, x2: 10, y2: 10 });
  });
});
