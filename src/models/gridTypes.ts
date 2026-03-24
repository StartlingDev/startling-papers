export const GRID_TYPES = [
  'square',
  'dot',
  'guide-dots',
  'staggered-dots',
  'diamond-dots',
  'isometric-dots',
  'triangle',
  'isometric',
  'pseudo-isometric',
  'rhombus',
  'hex',
  'graph',
  'horizontal-lines',
] as const;

export type GridType = (typeof GRID_TYPES)[number];

export const GRID_TYPE_LABELS: Record<GridType, string> = {
  square: 'Square',
  dot: 'Dot grid',
  'guide-dots': 'Guide dots',
  'staggered-dots': 'Staggered dots',
  'diamond-dots': 'Diamond dots',
  'isometric-dots': 'Isometric dots',
  triangle: 'Triangle grid',
  isometric: 'Isometric',
  'pseudo-isometric': 'Pseudo-isometric (1:2)',
  rhombus: 'Rhombus',
  hex: 'Hexagons',
  graph: 'Graph paper',
  'horizontal-lines': 'Horizontal lines',
};

export const GRID_TYPES_WITH_DOTS = new Set<GridType>([
  'dot',
  'guide-dots',
  'staggered-dots',
  'diamond-dots',
  'isometric-dots',
]);

export const GRID_TYPES_WITH_MAJOR_INTERVAL = new Set<GridType>(['guide-dots', 'graph']);
