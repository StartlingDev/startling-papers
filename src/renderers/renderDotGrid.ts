import type { RendererContext } from '@/renderers';
import {
  getBaseDotOpacity,
  getBaseDotRadius,
  renderDotCollection,
  type DotSpec,
} from '@/renderers/renderDotHelpers';

/**
 * Renders dot intersections centered within each cell.
 */
export function renderDotGrid({
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

  for (let y = startY; y < endY; y += config.cellSizeMm) {
    for (let x = startX; x < endX; x += config.cellSizeMm) {
      dots.push({ x, y });
    }
  }

  return renderDotCollection(dots, { clipPathId, strokeColor }, radius, opacity);
}
