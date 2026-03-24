import type { GridType } from '@/models/gridTypes';
import type { PageFormat } from '@/models/paperFormats';
import type { Unit } from '@/models/units';

export const MARGIN_PRESETS = ['none', 'tiny', 'regular', 'thick'] as const;

export type MarginPreset = (typeof MARGIN_PRESETS)[number];

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PaperConfig {
  gridType: GridType;
  unit: Unit;
  cellSize: number;
  lineIntensity: number;
  dotSize: number;
  strokeWidth: number;
  pageFormat: PageFormat;
  landscape: boolean;
  marginPreset: MarginPreset;
  showHeadingFields: boolean;
  showPageTitleArea: boolean;
  showCreditMark: boolean;
  graphMajorEvery: number;
}

export interface NormalizedPaperConfig extends PaperConfig {
  pageWidthMm: number;
  pageHeightMm: number;
  cellSizeMm: number;
  dotSizeMm: number;
  strokeWidthMm: number;
  marginsMm: Margins;
  contentArea: Rect;
  headingArea: Rect | null;
  patternArea: Rect;
}

export interface PaperTemplate {
  id: string;
  label: string;
  description: string;
  config: Partial<PaperConfig>;
}

export const MARGIN_PRESET_MM: Record<MarginPreset, number> = {
  none: 0,
  tiny: 5,
  regular: 10,
  thick: 16,
};

export const MARGIN_PRESET_LABELS: Record<MarginPreset, string> = {
  none: 'None',
  tiny: 'Tiny',
  regular: 'Regular',
  thick: 'Thick',
};

export const DEFAULT_PAPER_CONFIG: PaperConfig = {
  gridType: 'dot',
  unit: 'cm',
  cellSize: 1,
  lineIntensity: 0.3,
  dotSize: 0.03,
  strokeWidth: 0.02,
  pageFormat: 'A4',
  landscape: false,
  marginPreset: 'regular',
  showHeadingFields: false,
  showPageTitleArea: false,
  showCreditMark: true,
  graphMajorEvery: 5,
};

export const PAPER_TEMPLATES: PaperTemplate[] = [
  {
    id: 'default',
    label: 'Default layout',
    description: 'Clean dot paper with comfortable spacing and regular print margins.',
    config: DEFAULT_PAPER_CONFIG,
  },
  {
    id: 'notebook',
    label: 'School notebook',
    description: 'Ruled paper with a title/date heading.',
    config: {
      gridType: 'horizontal-lines',
      cellSize: 0.8,
      marginPreset: 'regular',
      showHeadingFields: true,
      showPageTitleArea: true,
    },
  },
  {
    id: 'bullet-journal',
    label: 'Bullet journal dots',
    description: 'Light dot grid for flexible note taking.',
    config: {
      gridType: 'dot',
      cellSize: 0.5,
      dotSize: 0.04,
      lineIntensity: 0.42,
      strokeWidth: 0.015,
    },
  },
  {
    id: 'engineering',
    label: 'Engineering graph',
    description: 'Graph paper with emphasized major divisions.',
    config: {
      gridType: 'graph',
      cellSize: 0.5,
      lineIntensity: 0.38,
      strokeWidth: 0.018,
      graphMajorEvery: 5,
    },
  },
  {
    id: 'iso-sketch',
    label: 'Isometric sketch',
    description: 'Isometric paper for technical sketching.',
    config: {
      gridType: 'isometric',
      cellSize: 0.5,
      lineIntensity: 0.32,
    },
  },
];
