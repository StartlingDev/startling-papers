import type { Unit } from '@/models/units';

export const MILLIMETERS_PER_CENTIMETER = 10;
export const MILLIMETERS_PER_INCH = 25.4;
export const POINTS_PER_MILLIMETER = 72 / MILLIMETERS_PER_INCH;

export function convertToMillimeters(value: number, unit: Unit): number {
  switch (unit) {
    case 'mm':
      return value;
    case 'cm':
      return value * MILLIMETERS_PER_CENTIMETER;
    case 'in':
      return value * MILLIMETERS_PER_INCH;
    default:
      return value;
  }
}

export function convertFromMillimeters(valueMm: number, unit: Unit): number {
  switch (unit) {
    case 'mm':
      return valueMm;
    case 'cm':
      return valueMm / MILLIMETERS_PER_CENTIMETER;
    case 'in':
      return valueMm / MILLIMETERS_PER_INCH;
    default:
      return valueMm;
  }
}

export function millimetersToPoints(valueMm: number): number {
  return valueMm * POINTS_PER_MILLIMETER;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function formatMeasurement(value: number, precision = 2): string {
  return Number(value.toFixed(precision)).toString();
}
