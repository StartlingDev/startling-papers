import type { RendererContext } from '@/renderers';
import { group, line } from '@/utils/svgHelpers';

/**
 * Renders notebook-style horizontal rules with consistent spacing.
 */
export function renderHorizontalLines({
  area,
  config,
  clipPathId,
  strokeColor,
}: RendererContext): string {
  const elements: string[] = [];
  const endX = area.x + area.width;
  const endY = area.y + area.height;
  const startY = area.y + config.cellSizeMm * 0.85;

  for (let y = startY; y <= endY + 0.0001; y += config.cellSizeMm) {
    elements.push(
      line(area.x, y, endX, y, {
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
