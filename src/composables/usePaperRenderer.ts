import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { PAGE_FORMAT_DEFINITIONS, resolvePageSize } from '@/models/paperFormats';
import {
  MARGIN_PRESET_MM,
  type NormalizedPaperConfig,
  type PaperConfig,
} from '@/models/paperConfig';
import { renderGridPattern } from '@/renderers';
import {
  computeHeadingHeight,
  createRect,
  insetRect,
  resolveMargins,
  splitPatternArea,
} from '@/utils/geometry';
import { convertToMillimeters } from '@/utils/unitConversion';
import { group, line, rect, text } from '@/utils/svgHelpers';

export interface PaperRenderResult {
  svgMarkup: string;
  previewSvgMarkup: string;
  normalizedConfig: NormalizedPaperConfig;
  filenameBase: string;
}

function normalizePaperConfig(config: PaperConfig): NormalizedPaperConfig {
  const pageSize = resolvePageSize(config.pageFormat, config.landscape);
  const pageRect = createRect(0, 0, pageSize.widthMm, pageSize.heightMm);
  const marginsMm = resolveMargins(config.marginPreset);
  const contentArea = insetRect(pageRect, marginsMm);
  const headingHeightMm = computeHeadingHeight(
    config.showHeadingFields,
    config.showPageTitleArea,
  );
  const { headingArea, patternArea } = splitPatternArea(contentArea, headingHeightMm);

  return {
    ...config,
    pageWidthMm: pageSize.widthMm,
    pageHeightMm: pageSize.heightMm,
    cellSizeMm: convertToMillimeters(config.cellSize, config.unit),
    dotSizeMm: convertToMillimeters(config.dotSize, config.unit),
    strokeWidthMm: convertToMillimeters(config.strokeWidth, config.unit),
    marginsMm,
    contentArea,
    headingArea,
    patternArea,
  };
}

function renderHeading(
  normalizedConfig: NormalizedPaperConfig,
  strokeColor: string,
): string {
  if (!normalizedConfig.headingArea) {
    return '';
  }

  const minimumInsetMm = MARGIN_PRESET_MM.tiny;
  const headingArea = insetRect(normalizedConfig.headingArea, {
    top: 0,
    right: Math.max(0, minimumInsetMm - normalizedConfig.marginsMm.right),
    bottom: 0,
    left: Math.max(0, minimumInsetMm - normalizedConfig.marginsMm.left),
  });
  const baselineY = headingArea.y + headingArea.height - 4;
  const labelY = headingArea.y + 5.2;
  const labelAttrs = {
    fill: '#6b7280',
    'font-size': '3.2',
    'font-family': "'Avenir Next', 'Segoe UI', sans-serif",
    'font-weight': 600,
  };
  const lineAttrs = {
    stroke: strokeColor,
    'stroke-width': 0.45,
    'stroke-opacity': 0.5,
  };
  const parts: string[] = [];

  if (normalizedConfig.showPageTitleArea && normalizedConfig.showHeadingFields) {
    const titleWidth = headingArea.width * 0.66;
    const dateX = headingArea.x + titleWidth + 10;
    const dateWidth = Math.max(headingArea.width - titleWidth - 10, 32);

    parts.push(text(headingArea.x, labelY, 'Title', labelAttrs));
    parts.push(line(headingArea.x, baselineY, headingArea.x + titleWidth, baselineY, lineAttrs));
    parts.push(text(dateX, labelY, 'Date', labelAttrs));
    parts.push(line(dateX, baselineY, dateX + dateWidth, baselineY, lineAttrs));
  } else if (normalizedConfig.showPageTitleArea) {
    parts.push(text(headingArea.x, labelY, 'Title', labelAttrs));
    parts.push(
      line(
        headingArea.x,
        baselineY,
        headingArea.x + headingArea.width,
        baselineY,
        lineAttrs,
      ),
    );
  } else if (normalizedConfig.showHeadingFields) {
    const nameWidth = headingArea.width * 0.58;
    const dateX = headingArea.x + nameWidth + 10;
    const dateWidth = Math.max(headingArea.width - nameWidth - 10, 30);

    parts.push(text(headingArea.x, labelY, 'Name', labelAttrs));
    parts.push(line(headingArea.x, baselineY, headingArea.x + nameWidth, baselineY, lineAttrs));
    parts.push(text(dateX, labelY, 'Date', labelAttrs));
    parts.push(line(dateX, baselineY, dateX + dateWidth, baselineY, lineAttrs));
  }

  return group(parts.join(''));
}

function renderCreditMark(normalizedConfig: NormalizedPaperConfig): string {
  if (!normalizedConfig.showCreditMark) {
    return '';
  }

  const cornerInsetX = 4.5;
  const cornerInsetY = 4.2;
  const creditText = 'Startling Papers by Startling Development';
  const x = normalizedConfig.pageWidthMm - cornerInsetX;
  const y = normalizedConfig.pageHeightMm - cornerInsetY;

  return group(
    [
      text(x, y, creditText, {
        fill: '#ffffff',
        'fill-opacity': 0.98,
        'font-size': '2.55',
        'font-family': "'Avenir Next', 'Segoe UI', sans-serif",
        'font-weight': 600,
        'letter-spacing': '0.03em',
        'paint-order': 'stroke fill',
        stroke: '#ffffff',
        'stroke-linejoin': 'round',
        'stroke-opacity': 0.98,
        'stroke-width': '1.15',
        'text-anchor': 'end',
      }),
      text(x, y, creditText, {
        fill: '#334155',
        'fill-opacity': 0.88,
        'font-size': '2.55',
        'font-family': "'Avenir Next', 'Segoe UI', sans-serif",
        'font-weight': 600,
        'letter-spacing': '0.03em',
        'text-anchor': 'end',
      }),
    ].join(''),
  );
}

function buildPaperSvg(normalizedConfig: NormalizedPaperConfig): string {
  const clipPathId = 'paper-pattern-clip';
  const backgroundColor = '#ffffff';
  const frameColor = '#d9dee6';
  const strokeColor = '#1f2937';
  const accentColor = '#334155';
  const heading = renderHeading(normalizedConfig, strokeColor);
  const pattern = renderGridPattern({
    area: normalizedConfig.patternArea,
    config: normalizedConfig,
    clipPathId,
    strokeColor,
    accentColor,
  });
  const creditMark = renderCreditMark(normalizedConfig);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${normalizedConfig.pageWidthMm} ${normalizedConfig.pageHeightMm}" width="${normalizedConfig.pageWidthMm}mm" height="${normalizedConfig.pageHeightMm}mm" role="img" aria-label="Generated printable paper">`,
    '<defs>',
    `<clipPath id="${clipPathId}">`,
    rect(
      normalizedConfig.patternArea.x,
      normalizedConfig.patternArea.y,
      normalizedConfig.patternArea.width,
      normalizedConfig.patternArea.height,
    ),
    '</clipPath>',
    '</defs>',
    rect(0, 0, normalizedConfig.pageWidthMm, normalizedConfig.pageHeightMm, {
      fill: backgroundColor,
      stroke: frameColor,
      'stroke-width': 0.4,
    }),
    heading,
    pattern,
    creditMark,
    '</svg>',
  ].join('');
}

export function usePaperRenderer(config: MaybeRefOrGetter<PaperConfig>) {
  const normalizedConfig = computed(() => normalizePaperConfig(toValue(config)));

  const svgMarkup = computed(() => buildPaperSvg(normalizedConfig.value));
  const previewSvgMarkup = computed(() => buildPaperSvg(normalizedConfig.value));
  const filenameBase = computed(() => {
    const pageLabel = PAGE_FORMAT_DEFINITIONS[normalizedConfig.value.pageFormat].label
      .toLowerCase()
      .replaceAll(' ', '-');

    return `${normalizedConfig.value.gridType}-${pageLabel}-${normalizedConfig.value.landscape ? 'landscape' : 'portrait'}`;
  });

  const renderedPaper = computed<PaperRenderResult>(() => ({
    svgMarkup: svgMarkup.value,
    previewSvgMarkup: previewSvgMarkup.value,
    normalizedConfig: normalizedConfig.value,
    filenameBase: filenameBase.value,
  }));

  return {
    normalizedConfig,
    svgMarkup,
    previewSvgMarkup,
    filenameBase,
    renderedPaper,
  };
}
