export const UNITS = ['mm', 'cm', 'in'] as const;

export type Unit = (typeof UNITS)[number];

export const UNIT_LABELS: Record<Unit, string> = {
  mm: 'Millimeters',
  cm: 'Centimeters',
  in: 'Inches',
};

export interface MeasurementRange {
  min: number;
  max: number;
  step: number;
}

export interface MeasurementRangeMap {
  cellSize: MeasurementRange;
  dotSize: MeasurementRange;
  strokeWidth: MeasurementRange;
}

export const UNIT_MEASUREMENT_RANGES: Record<Unit, MeasurementRangeMap> = {
  mm: {
    cellSize: { min: 2, max: 25, step: 0.5 },
    dotSize: { min: 0.2, max: 2.2, step: 0.1 },
    strokeWidth: { min: 0.1, max: 1.2, step: 0.05 },
  },
  cm: {
    cellSize: { min: 0.2, max: 2.5, step: 0.05 },
    dotSize: { min: 0.02, max: 0.22, step: 0.01 },
    strokeWidth: { min: 0.01, max: 0.12, step: 0.005 },
  },
  in: {
    cellSize: { min: 0.1, max: 1, step: 0.05 },
    dotSize: { min: 0.01, max: 0.09, step: 0.005 },
    strokeWidth: { min: 0.005, max: 0.05, step: 0.0025 },
  },
};
