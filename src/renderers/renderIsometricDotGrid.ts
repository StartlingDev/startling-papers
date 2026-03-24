import type { RendererContext } from '@/renderers';
import {
  getBaseDotOpacity,
  getBaseDotRadius,
  renderDotCollection,
  type DotSpec,
} from '@/renderers/renderDotHelpers';

/**
 * Renders a triangular point lattice for point-based isometric sketching.
 */
export function renderIsometricDotGrid({
  area,
  config,
  clipPathId,
  strokeColor,
}: RendererContext): string {
  const dots: DotSpec[] = [];
  const radius = getBaseDotRadius(config);
  const opacity = getBaseDotOpacity(config);
  const rowStep = (config.cellSizeMm * Math.sqrt(3)) / 2;
  const startX = area.x + config.cellSizeMm / 2;
  const endX = area.x + area.width;
  const endY = area.y + area.height;
  let rowIndex = 0;

  for (let y = area.y + rowStep / 2; y < endY; y += rowStep) {
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
