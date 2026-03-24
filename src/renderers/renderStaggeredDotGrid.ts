import type { RendererContext } from '@/renderers';
import {
  getBaseDotOpacity,
  getBaseDotRadius,
  renderDotCollection,
  type DotSpec,
} from '@/renderers/renderDotHelpers';

/**
 * Renders offset rows of dots for a softer, less rigid notebook texture.
 */
export function renderStaggeredDotGrid({
  area,
  config,
  clipPathId,
  strokeColor,
}: RendererContext): string {
  const dots: DotSpec[] = [];
  const radius = getBaseDotRadius(config);
  const opacity = getBaseDotOpacity(config);
  const startX = area.x + config.cellSizeMm / 2;
  const startY = area.y + config.cellSizeMm / 2;
  const endX = area.x + area.width;
  const endY = area.y + area.height;
  let rowIndex = 0;

  for (let y = startY; y < endY; y += config.cellSizeMm) {
    const rowOffset = rowIndex % 2 === 0 ? 0 : config.cellSizeMm / 2;

    for (let x = startX + rowOffset; x < endX + config.cellSizeMm / 2; x += config.cellSizeMm) {
      if (x >= area.x && x < endX) {
        dots.push({ x, y });
      }
    }

    rowIndex += 1;
  }

  return renderDotCollection(dots, { clipPathId, strokeColor }, radius, opacity);
}
