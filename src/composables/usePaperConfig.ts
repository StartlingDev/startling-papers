import { computed, ref, watch } from 'vue';
import {
  DEFAULT_PAPER_CONFIG,
  MARGIN_PRESETS,
  PAPER_TEMPLATES,
  type MarginPreset,
  type PaperConfig,
} from '@/models/paperConfig';
import { GRID_TYPES, type GridType } from '@/models/gridTypes';
import { PAGE_FORMATS, type PageFormat } from '@/models/paperFormats';
import { UNITS, UNIT_MEASUREMENT_RANGES, type Unit } from '@/models/units';
import {
  clampNumber,
  convertFromMillimeters,
  convertToMillimeters,
  roundToStep,
} from '@/utils/unitConversion';

const STORAGE_KEY = 'printable-paper-studio.config';
const MEASUREMENT_KEYS = ['cellSize', 'dotSize', 'strokeWidth'] as const;

function isGridType(value: string): value is GridType {
  return GRID_TYPES.includes(value as GridType);
}

function isUnit(value: string): value is Unit {
  return UNITS.includes(value as Unit);
}

function isPageFormat(value: string): value is PageFormat {
  return PAGE_FORMATS.includes(value as PageFormat);
}

function isMarginPreset(value: string): value is MarginPreset {
  return MARGIN_PRESETS.includes(value as MarginPreset);
}

function serializeConfig(config: PaperConfig): string {
  const params = new URLSearchParams();

  params.set('grid', config.gridType);
  params.set('unit', config.unit);
  params.set('cell', String(config.cellSize));
  params.set('intensity', String(config.lineIntensity));
  params.set('dot', String(config.dotSize));
  params.set('stroke', String(config.strokeWidth));
  params.set('page', config.pageFormat);
  params.set('landscape', String(config.landscape));
  params.set('margin', config.marginPreset);
  params.set('heading', String(config.showHeadingFields));
  params.set('title', String(config.showPageTitleArea));
  params.set('credit', String(config.showCreditMark));
  params.set('major', String(config.graphMajorEvery));

  return params.toString();
}

function parseBoolean(value: string | null, fallback: boolean): boolean {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return fallback;
}

function resolveFiniteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function sanitizeConfig(input: Partial<PaperConfig>): PaperConfig {
  const resolvedUnit: Unit =
    input.unit !== undefined && isUnit(input.unit)
      ? input.unit
      : DEFAULT_PAPER_CONFIG.unit;
  const merged: PaperConfig = {
    ...DEFAULT_PAPER_CONFIG,
    ...input,
    unit: resolvedUnit,
  };
  const ranges = UNIT_MEASUREMENT_RANGES[resolvedUnit];

  return {
    ...merged,
    gridType: isGridType(merged.gridType) ? merged.gridType : DEFAULT_PAPER_CONFIG.gridType,
    unit: isUnit(merged.unit) ? merged.unit : DEFAULT_PAPER_CONFIG.unit,
    pageFormat: isPageFormat(merged.pageFormat)
      ? merged.pageFormat
      : DEFAULT_PAPER_CONFIG.pageFormat,
    marginPreset: isMarginPreset(merged.marginPreset)
      ? merged.marginPreset
      : DEFAULT_PAPER_CONFIG.marginPreset,
    cellSize: roundToStep(
      clampNumber(
        resolveFiniteNumber(merged.cellSize, DEFAULT_PAPER_CONFIG.cellSize),
        ranges.cellSize.min,
        ranges.cellSize.max,
      ),
      ranges.cellSize.step,
    ),
    lineIntensity: clampNumber(
      resolveFiniteNumber(merged.lineIntensity, DEFAULT_PAPER_CONFIG.lineIntensity),
      0.08,
      0.92,
    ),
    dotSize: roundToStep(
      clampNumber(
        resolveFiniteNumber(merged.dotSize, DEFAULT_PAPER_CONFIG.dotSize),
        ranges.dotSize.min,
        ranges.dotSize.max,
      ),
      ranges.dotSize.step,
    ),
    strokeWidth: roundToStep(
      clampNumber(
        resolveFiniteNumber(merged.strokeWidth, DEFAULT_PAPER_CONFIG.strokeWidth),
        ranges.strokeWidth.min,
        ranges.strokeWidth.max,
      ),
      ranges.strokeWidth.step,
    ),
    graphMajorEvery: Math.round(
      clampNumber(
        resolveFiniteNumber(merged.graphMajorEvery, DEFAULT_PAPER_CONFIG.graphMajorEvery),
        2,
        8,
      ),
    ),
    landscape: Boolean(merged.landscape),
    showHeadingFields: Boolean(merged.showHeadingFields),
    showPageTitleArea: Boolean(merged.showPageTitleArea),
    showCreditMark:
      merged.showCreditMark === undefined
        ? DEFAULT_PAPER_CONFIG.showCreditMark
        : Boolean(merged.showCreditMark),
  };
}

function loadInitialConfig(): PaperConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_PAPER_CONFIG;
  }

  const query = new URLSearchParams(window.location.search);
  const fromQuery: Partial<PaperConfig> = {};

  if (query.has('grid')) {
    fromQuery.gridType = query.get('grid') as GridType;
  }
  if (query.has('unit')) {
    fromQuery.unit = query.get('unit') as Unit;
  }
  if (query.has('cell')) {
    fromQuery.cellSize = Number(query.get('cell'));
  }
  if (query.has('intensity')) {
    fromQuery.lineIntensity = Number(query.get('intensity'));
  }
  if (query.has('dot')) {
    fromQuery.dotSize = Number(query.get('dot'));
  }
  if (query.has('stroke')) {
    fromQuery.strokeWidth = Number(query.get('stroke'));
  }
  if (query.has('page')) {
    fromQuery.pageFormat = query.get('page') as PageFormat;
  }
  if (query.has('landscape')) {
    fromQuery.landscape = parseBoolean(query.get('landscape'), DEFAULT_PAPER_CONFIG.landscape);
  }
  if (query.has('margin')) {
    fromQuery.marginPreset = query.get('margin') as MarginPreset;
  }
  if (query.has('heading')) {
    fromQuery.showHeadingFields = parseBoolean(
      query.get('heading'),
      DEFAULT_PAPER_CONFIG.showHeadingFields,
    );
  }
  if (query.has('title')) {
    fromQuery.showPageTitleArea = parseBoolean(
      query.get('title'),
      DEFAULT_PAPER_CONFIG.showPageTitleArea,
    );
  }
  if (query.has('credit')) {
    fromQuery.showCreditMark = parseBoolean(
      query.get('credit'),
      DEFAULT_PAPER_CONFIG.showCreditMark,
    );
  }
  if (query.has('major')) {
    fromQuery.graphMajorEvery = Number(query.get('major'));
  }

  if (Object.keys(fromQuery).length > 0) {
    return sanitizeConfig(fromQuery);
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return DEFAULT_PAPER_CONFIG;
  }

  try {
    return sanitizeConfig(JSON.parse(stored) as Partial<PaperConfig>);
  } catch {
    return DEFAULT_PAPER_CONFIG;
  }
}

export function resolveTemplateConfig(
  templateConfig: Partial<PaperConfig>,
  targetUnit: Unit,
): Partial<PaperConfig> {
  const templateUnit = templateConfig.unit ?? DEFAULT_PAPER_CONFIG.unit;
  const resolvedConfig: Partial<PaperConfig> = {
    ...templateConfig,
    unit: targetUnit,
  };

  for (const key of MEASUREMENT_KEYS) {
    const value = templateConfig[key];

    if (value === undefined) {
      continue;
    }

    resolvedConfig[key] = convertFromMillimeters(
      convertToMillimeters(value, templateUnit),
      targetUnit,
    );
  }

  return resolvedConfig;
}

export function usePaperConfig() {
  const config = ref<PaperConfig>(loadInitialConfig());
  const measurementRanges = computed(() => UNIT_MEASUREMENT_RANGES[config.value.unit]);
  const templateOptions = PAPER_TEMPLATES;

  function setConfig(nextConfig: PaperConfig): void {
    const previous = config.value;
    const hasUnitChanged = previous.unit !== nextConfig.unit;

    if (hasUnitChanged) {
      const cellSizeMm = convertToMillimeters(previous.cellSize, previous.unit);
      const dotSizeMm = convertToMillimeters(previous.dotSize, previous.unit);
      const strokeWidthMm = convertToMillimeters(previous.strokeWidth, previous.unit);

      config.value = sanitizeConfig({
        ...nextConfig,
        cellSize: convertFromMillimeters(cellSizeMm, nextConfig.unit),
        dotSize: convertFromMillimeters(dotSizeMm, nextConfig.unit),
        strokeWidth: convertFromMillimeters(strokeWidthMm, nextConfig.unit),
      });

      return;
    }

    config.value = sanitizeConfig(nextConfig);
  }

  function applyPatch(patch: Partial<PaperConfig>): void {
    setConfig({
      ...config.value,
      ...patch,
    });
  }

  function applyTemplate(templateId: string): void {
    const template = templateOptions.find((candidate) => candidate.id === templateId);

    if (!template) {
      return;
    }

    applyPatch(resolveTemplateConfig(template.config, config.value.unit));
  }

  function reset(): void {
    config.value = { ...DEFAULT_PAPER_CONFIG };
  }

  watch(
    config,
    (value) => {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));

      const url = new URL(window.location.href);
      url.search = serializeConfig(value);
      window.history.replaceState({}, '', url);
    },
    { deep: true },
  );

  return {
    config,
    measurementRanges,
    templateOptions,
    setConfig,
    applyPatch,
    applyTemplate,
    reset,
  };
}
