import { describe, expect, it } from 'vitest';
import {
  convertFromMillimeters,
  convertToMillimeters,
  millimetersToPoints,
} from '@/utils/unitConversion';

describe('unit conversion', () => {
  it('converts centimeters and inches to millimeters', () => {
    expect(convertToMillimeters(0.5, 'cm')).toBeCloseTo(5);
    expect(convertToMillimeters(1, 'in')).toBeCloseTo(25.4);
  });

  it('converts millimeters back to user units', () => {
    expect(convertFromMillimeters(12.7, 'cm')).toBeCloseTo(1.27);
    expect(convertFromMillimeters(25.4, 'in')).toBeCloseTo(1);
  });

  it('converts millimeters to PDF points', () => {
    expect(millimetersToPoints(25.4)).toBeCloseTo(72);
  });
});
