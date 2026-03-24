import type { RendererContext } from '@/renderers';
import { group, line } from '@/utils/svgHelpers';

/**
 * Renders graph paper with lighter minor divisions and darker major lines.
 */
export function renderGraphPaper({
  area,
  config,
  clipPathId,
  strokeColor,
  accentColor,
}: RendererContext): string {
  const minorElements: string[] = [];
  const majorElements: string[] = [];
  const endX = area.x + area.width;
  const endY = area.y + area.height;
  const majorInterval = Math.max(2, Math.round(config.graphMajorEvery));
  const minorOpacity = Math.max(config.lineIntensity * 0.8, 0.12);
  const majorOpacity = Math.min(config.lineIntensity + 0.24, 0.85);
  const majorStrokeWidth = Math.max(config.strokeWidthMm * 1.8, config.strokeWidthMm + 0.08);

  let index = 0;
  for (let x = area.x; x <= endX + 0.0001; x += config.cellSizeMm) {
    const target = index % majorInterval === 0 ? majorElements : minorElements;
    const stroke = index % majorInterval === 0 ? accentColor : strokeColor;
    const opacity = index % majorInterval === 0 ? majorOpacity : minorOpacity;
    const strokeWidth = index % majorInterval === 0 ? majorStrokeWidth : config.strokeWidthMm;

    target.push(
      line(x, area.y, x, endY, {
        stroke,
        'stroke-width': strokeWidth,
        'stroke-opacity': opacity,
      }),
    );

    index += 1;
  }

  index = 0;
  for (let y = area.y; y <= endY + 0.0001; y += config.cellSizeMm) {
    const target = index % majorInterval === 0 ? majorElements : minorElements;
    const stroke = index % majorInterval === 0 ? accentColor : strokeColor;
    const opacity = index % majorInterval === 0 ? majorOpacity : minorOpacity;
    const strokeWidth = index % majorInterval === 0 ? majorStrokeWidth : config.strokeWidthMm;

    target.push(
      line(area.x, y, endX, y, {
        stroke,
        'stroke-width': strokeWidth,
        'stroke-opacity': opacity,
      }),
    );

    index += 1;
  }

  return group(minorElements.join('') + majorElements.join(''), {
    'clip-path': `url(#${clipPathId})`,
    fill: 'none',
  });
}
