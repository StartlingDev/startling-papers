import type { RendererContext } from '@/renderers';
import {
  getBaseDotOpacity,
  getBaseDotRadius,
  renderDotCollection,
  type DotSpec,
} from '@/renderers/renderDotHelpers';

/**
 * Renders a rotated square lattice, creating a diamond-oriented dot rhythm.
 */
export function renderDiamondDotGrid({
  area,
  config,
  clipPathId,
  strokeColor,
}: RendererContext): string {
  const dots: DotSpec[] = [];
  const radius = getBaseDotRadius(config);
  const opacity = getBaseDotOpacity(config);
  const diagonalStep = config.cellSizeMm / Math.SQRT2;
  const horizontalStep = diagonalStep * 2;
  const endX = area.x + area.width;
  const endY = area.y + area.height;
  let rowIndex = 0;

  for (let y = area.y + diagonalStep; y < endY; y += diagonalStep) {
    const rowOffset = rowIndex % 2 === 0 ? 0 : diagonalStep;

    for (
      let x = area.x + diagonalStep + rowOffset;
      x < endX + diagonalStep;
      x += horizontalStep
    ) {
      if (x >= area.x && x < endX) {
        dots.push({ x, y });
      }
    }

    rowIndex += 1;
  }

  return renderDotCollection(dots, { clipPathId, strokeColor }, radius, opacity);
}
