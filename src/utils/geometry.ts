import {
  MARGIN_PRESET_MM,
  type MarginPreset,
  type Margins,
  type Rect,
} from '@/models/paperConfig';

export interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface HexMetrics {
  sideMm: number;
  widthMm: number;
  heightMm: number;
  horizontalStepMm: number;
  verticalStepMm: number;
}

export function resolveMargins(marginPreset: MarginPreset): Margins {
  const margin = MARGIN_PRESET_MM[marginPreset];

  return {
    top: margin,
    right: margin,
    bottom: margin,
    left: margin,
  };
}

export function insetRect(rect: Rect, margins: Margins): Rect {
  return {
    x: rect.x + margins.left,
    y: rect.y + margins.top,
    width: Math.max(0, rect.width - margins.left - margins.right),
    height: Math.max(0, rect.height - margins.top - margins.bottom),
  };
}

export function createRect(
  x: number,
  y: number,
  width: number,
  height: number,
): Rect {
  return { x, y, width, height };
}

export function computeHeadingHeight(
  showHeadingFields: boolean,
  showPageTitleArea: boolean,
): number {
  if (showHeadingFields && showPageTitleArea) {
    return 20;
  }

  if (showHeadingFields || showPageTitleArea) {
    return 14;
  }

  return 0;
}

export function splitPatternArea(
  contentArea: Rect,
  headingHeightMm: number,
): { headingArea: Rect | null; patternArea: Rect } {
  if (headingHeightMm <= 0) {
    return {
      headingArea: null,
      patternArea: contentArea,
    };
  }

  const headingArea = createRect(
    contentArea.x,
    contentArea.y,
    contentArea.width,
    Math.min(headingHeightMm, contentArea.height),
  );

  const gapMm = 4;

  return {
    headingArea,
    patternArea: createRect(
      contentArea.x,
      contentArea.y + headingArea.height + gapMm,
      contentArea.width,
      Math.max(0, contentArea.height - headingArea.height - gapMm),
    ),
  };
}

export function getHexMetrics(sideMm: number): HexMetrics {
  const widthMm = 2 * sideMm;
  const heightMm = Math.sqrt(3) * sideMm;

  return {
    sideMm,
    widthMm,
    heightMm,
    horizontalStepMm: sideMm * 1.5,
    verticalStepMm: heightMm,
  };
}

function dedupePoints(points: Array<{ x: number; y: number }>): Array<{
  x: number;
  y: number;
}> {
  const epsilon = 1e-6;

  return points.filter((point, index) =>
    points.findIndex(
      (candidate) =>
        Math.abs(candidate.x - point.x) < epsilon &&
        Math.abs(candidate.y - point.y) < epsilon,
    ) === index,
  );
}

/**
 * Generates clipped line segments for a family of parallel lines over a rectangle.
 */
export function generateParallelLineSegments(
  rect: Rect,
  angleDeg: number,
  spacingMm: number,
): LineSegment[] {
  if (rect.width <= 0 || rect.height <= 0 || spacingMm <= 0) {
    return [];
  }

  const angleRad = (angleDeg * Math.PI) / 180;
  const normal = {
    x: -Math.sin(angleRad),
    y: Math.cos(angleRad),
  };

  const corners = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ];

  const projections = corners.map((corner) => corner.x * normal.x + corner.y * normal.y);
  const minProjection = Math.min(...projections);
  const maxProjection = Math.max(...projections);
  const startIndex = Math.floor(minProjection / spacingMm) - 1;
  const endIndex = Math.ceil(maxProjection / spacingMm) + 1;
  const segments: LineSegment[] = [];
  const epsilon = 1e-8;

  for (let index = startIndex; index <= endIndex; index += 1) {
    const constant = index * spacingMm;
    const intersections: Array<{ x: number; y: number }> = [];
    const minX = rect.x;
    const maxX = rect.x + rect.width;
    const minY = rect.y;
    const maxY = rect.y + rect.height;

    if (Math.abs(normal.y) > epsilon) {
      const yAtMinX = (constant - normal.x * minX) / normal.y;
      const yAtMaxX = (constant - normal.x * maxX) / normal.y;

      if (yAtMinX >= minY - epsilon && yAtMinX <= maxY + epsilon) {
        intersections.push({ x: minX, y: yAtMinX });
      }

      if (yAtMaxX >= minY - epsilon && yAtMaxX <= maxY + epsilon) {
        intersections.push({ x: maxX, y: yAtMaxX });
      }
    }

    if (Math.abs(normal.x) > epsilon) {
      const xAtMinY = (constant - normal.y * minY) / normal.x;
      const xAtMaxY = (constant - normal.y * maxY) / normal.x;

      if (xAtMinY >= minX - epsilon && xAtMinY <= maxX + epsilon) {
        intersections.push({ x: xAtMinY, y: minY });
      }

      if (xAtMaxY >= minX - epsilon && xAtMaxY <= maxX + epsilon) {
        intersections.push({ x: xAtMaxY, y: maxY });
      }
    }

    const uniqueIntersections = dedupePoints(intersections);

    if (uniqueIntersections.length >= 2) {
      const first = uniqueIntersections[0];
      const second = uniqueIntersections[1];

      if (!first || !second) {
        continue;
      }

      segments.push({
        x1: first.x,
        y1: first.y,
        x2: second.x,
        y2: second.y,
      });
    }
  }

  return segments;
}
