import type { RendererContext } from '@/renderers';
import { generateParallelLineSegments } from '@/utils/geometry';
import { group, line } from '@/utils/svgHelpers';

/**
 * Renders a 1:2 pseudo-isometric grid suited to quick box sketches.
 */
export function renderPseudoIsometricGrid({
  area,
  config,
  clipPathId,
  strokeColor,
}: RendererContext): string {
  const elements: string[] = [];
  const rise = config.cellSizeMm / 2;
  const run = config.cellSizeMm;
  const angle = (Math.atan2(rise, run) * 180) / Math.PI;
  const diagonalSpacing = config.cellSizeMm / Math.sqrt(5);

  const families = [
    { angle: 0, spacing: rise },
    { angle, spacing: diagonalSpacing },
    { angle: -angle, spacing: diagonalSpacing },
  ];

  for (const family of families) {
    const segments = generateParallelLineSegments(area, family.angle, family.spacing);

    for (const segment of segments) {
      elements.push(
        line(segment.x1, segment.y1, segment.x2, segment.y2, {
          stroke: strokeColor,
          'stroke-width': config.strokeWidthMm,
          'stroke-opacity': config.lineIntensity,
        }),
      );
    }
  }

  return group(elements.join(''), {
    'clip-path': `url(#${clipPathId})`,
    fill: 'none',
  });
}
