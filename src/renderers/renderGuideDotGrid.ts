import type { RendererContext } from '@/renderers';
import {
  getBaseDotOpacity,
  getBaseDotRadius,
  renderDotCollection,
  type DotSpec,
} from '@/renderers/renderDotHelpers';

/**
 * Renders a square dot grid with larger guide dots at a regular interval.
 */
export function renderGuideDotGrid({
  area,
  config,
  clipPathId,
  strokeColor,
}: RendererContext): string {
  const dots: DotSpec[] = [];
  const radius = getBaseDotRadius(config);
  const opacity = getBaseDotOpacity(config);
  const majorInterval = Math.max(2, Math.round(config.graphMajorEvery));
  const majorRadius = Math.max(radius * 1.65, radius + 0.08);
  const majorOpacity = Math.min(opacity + 0.16, 0.95);
  const startX = area.x + config.cellSizeMm / 2;
  const startY = area.y + config.cellSizeMm / 2;
  const endX = area.x + area.width;
  const endY = area.y + area.height;

  let rowIndex = 0;
  for (let y = startY; y < endY; y += config.cellSizeMm) {
    let columnIndex = 0;

    for (let x = startX; x < endX; x += config.cellSizeMm) {
      const isMajorDot = rowIndex % majorInterval === 0 && columnIndex % majorInterval === 0;

      dots.push({
        x,
        y,
        opacity: isMajorDot ? majorOpacity : opacity,
        radius: isMajorDot ? majorRadius : radius,
      });

      columnIndex += 1;
    }

    rowIndex += 1;
  }

  return renderDotCollection(dots, { clipPathId, strokeColor }, radius, opacity);
}
