import type { RendererContext } from '@/renderers';
import { generateParallelLineSegments } from '@/utils/geometry';
import { group, line } from '@/utils/svgHelpers';

/**
 * Renders an equilateral triangular lattice.
 */
export function renderTriangleGrid({
  area,
  config,
  clipPathId,
  strokeColor,
}: RendererContext): string {
  const elements: string[] = [];
  const spacing = (config.cellSizeMm * Math.sqrt(3)) / 2;
  const segments = [
    ...generateParallelLineSegments(area, 90, spacing),
    ...generateParallelLineSegments(area, 30, spacing),
    ...generateParallelLineSegments(area, -30, spacing),
  ];

  for (const segment of segments) {
    elements.push(
      line(segment.x1, segment.y1, segment.x2, segment.y2, {
        stroke: strokeColor,
        'stroke-width': config.strokeWidthMm,
        'stroke-opacity': config.lineIntensity,
      }),
    );
  }

  return group(elements.join(''), {
    'clip-path': `url(#${clipPathId})`,
    fill: 'none',
  });
}
