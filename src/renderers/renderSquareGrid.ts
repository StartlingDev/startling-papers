import type { RendererContext } from '@/renderers';
import { group, line } from '@/utils/svgHelpers';

/**
 * Renders a standard square grid across the printable pattern area.
 */
export function renderSquareGrid({
  area,
  config,
  clipPathId,
  strokeColor,
}: RendererContext): string {
  const elements: string[] = [];
  const endX = area.x + area.width;
  const endY = area.y + area.height;

  for (let x = area.x; x <= endX + 0.0001; x += config.cellSizeMm) {
    elements.push(
      line(x, area.y, x, endY, {
        stroke: strokeColor,
        'stroke-width': config.strokeWidthMm,
        'stroke-opacity': config.lineIntensity,
      }),
    );
  }

  for (let y = area.y; y <= endY + 0.0001; y += config.cellSizeMm) {
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
