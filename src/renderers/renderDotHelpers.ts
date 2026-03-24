import type { RendererContext } from '@/renderers';
import { circle, group } from '@/utils/svgHelpers';

export interface DotSpec {
  x: number;
  y: number;
  radius?: number;
  opacity?: number;
}

export function getBaseDotRadius(config: RendererContext['config']): number {
  return Math.max(config.dotSizeMm, 0.12);
}

export function getBaseDotOpacity(config: RendererContext['config']): number {
  return Math.min(config.lineIntensity + 0.1, 0.85);
}

export function renderDotCollection(
  dots: DotSpec[],
  context: Pick<RendererContext, 'clipPathId' | 'strokeColor'>,
  defaultRadius: number,
  defaultOpacity: number,
): string {
  return group(
    dots
      .map((dot) =>
        circle(dot.x, dot.y, dot.radius ?? defaultRadius, {
          fill: context.strokeColor,
          'fill-opacity': dot.opacity ?? defaultOpacity,
        }),
      )
      .join(''),
    {
      'clip-path': `url(#${context.clipPathId})`,
    },
  );
}
