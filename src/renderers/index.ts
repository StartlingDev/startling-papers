import type { GridType } from '@/models/gridTypes';
import type { NormalizedPaperConfig, Rect } from '@/models/paperConfig';
import { renderDiamondDotGrid } from '@/renderers/renderDiamondDotGrid';
import { renderDotGrid } from '@/renderers/renderDotGrid';
import { renderGraphPaper } from '@/renderers/renderGraphPaper';
import { renderGuideDotGrid } from '@/renderers/renderGuideDotGrid';
import { renderHexGrid } from '@/renderers/renderHexGrid';
import { renderHorizontalLines } from '@/renderers/renderHorizontalLines';
import { renderIsometricDotGrid } from '@/renderers/renderIsometricDotGrid';
import { renderIsometricGrid } from '@/renderers/renderIsometricGrid';
import { renderPseudoIsometricGrid } from '@/renderers/renderPseudoIsometricGrid';
import { renderRhombusGrid } from '@/renderers/renderRhombusGrid';
import { renderSquareGrid } from '@/renderers/renderSquareGrid';
import { renderStaggeredDotGrid } from '@/renderers/renderStaggeredDotGrid';
import { renderTriangleGrid } from '@/renderers/renderTriangleGrid';

export interface RendererContext {
  area: Rect;
  config: NormalizedPaperConfig;
  clipPathId: string;
  strokeColor: string;
  accentColor: string;
}

export type GridRenderer = (context: RendererContext) => string;

const GRID_RENDERERS: Record<GridType, GridRenderer> = {
  square: renderSquareGrid,
  dot: renderDotGrid,
  'guide-dots': renderGuideDotGrid,
  'staggered-dots': renderStaggeredDotGrid,
  'diamond-dots': renderDiamondDotGrid,
  'isometric-dots': renderIsometricDotGrid,
  triangle: renderTriangleGrid,
  isometric: renderIsometricGrid,
  'pseudo-isometric': renderPseudoIsometricGrid,
  rhombus: renderRhombusGrid,
  hex: renderHexGrid,
  graph: renderGraphPaper,
  'horizontal-lines': renderHorizontalLines,
};

export function renderGridPattern(context: RendererContext): string {
  return GRID_RENDERERS[context.config.gridType](context);
}
