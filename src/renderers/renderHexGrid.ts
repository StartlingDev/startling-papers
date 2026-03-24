import type { RendererContext } from '@/renderers';
import { getHexMetrics } from '@/utils/geometry';
import { group, polygon } from '@/utils/svgHelpers';

/**
 * Renders a flat-top hexagon tiling with correct staggered offsets.
 */
export function renderHexGrid({
  area,
  config,
  clipPathId,
  strokeColor,
}: RendererContext): string {
  const metrics = getHexMetrics(config.cellSizeMm);
  const elements: string[] = [];
  const centerStartX = area.x + metrics.sideMm;
  const centerStartY = area.y + metrics.heightMm / 2;
  const maxX = area.x + area.width + metrics.widthMm;
  const maxY = area.y + area.height + metrics.heightMm;

  for (
    let centerX = centerStartX - metrics.horizontalStepMm;
    centerX <= maxX;
    centerX += metrics.horizontalStepMm
  ) {
    const columnIndex = Math.round((centerX - centerStartX) / metrics.horizontalStepMm);
    const columnOffsetY = Math.abs(columnIndex % 2) * (metrics.heightMm / 2);

    for (
      let centerY = centerStartY - metrics.heightMm + columnOffsetY;
      centerY <= maxY;
      centerY += metrics.verticalStepMm
    ) {
      elements.push(
        polygon(
          [
            { x: centerX - metrics.sideMm / 2, y: centerY - metrics.heightMm / 2 },
            { x: centerX + metrics.sideMm / 2, y: centerY - metrics.heightMm / 2 },
            { x: centerX + metrics.sideMm, y: centerY },
            { x: centerX + metrics.sideMm / 2, y: centerY + metrics.heightMm / 2 },
            { x: centerX - metrics.sideMm / 2, y: centerY + metrics.heightMm / 2 },
            { x: centerX - metrics.sideMm, y: centerY },
          ],
          {
            fill: 'none',
            stroke: strokeColor,
            'stroke-width': config.strokeWidthMm,
            'stroke-opacity': config.lineIntensity,
          },
        ),
      );
    }
  }

  return group(elements.join(''), {
    'clip-path': `url(#${clipPathId})`,
  });
}
