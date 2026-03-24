<script setup lang="ts">
import { ref } from 'vue';
import ExportButtons from '@/components/ExportButtons.vue';
import FormField from '@/components/FormField.vue';
import {
  GRID_TYPE_LABELS,
  GRID_TYPES,
  GRID_TYPES_WITH_DOTS,
  GRID_TYPES_WITH_MAJOR_INTERVAL,
} from '@/models/gridTypes';
import {
  MARGIN_PRESET_LABELS,
  type PaperConfig,
  type PaperTemplate,
} from '@/models/paperConfig';
import { PAGE_FORMAT_DEFINITIONS, PAGE_FORMATS } from '@/models/paperFormats';
import { UNIT_LABELS, type MeasurementRangeMap, UNITS } from '@/models/units';
import { formatMeasurement } from '@/utils/unitConversion';

const props = defineProps<{
  config: PaperConfig;
  measurementRanges: MeasurementRangeMap;
  templateOptions: PaperTemplate[];
  isExporting: boolean;
  canExport: boolean;
  exportError: string | null;
}>();

const emit = defineEmits<{
  (event: 'update:config', value: PaperConfig): void;
  (event: 'apply-template', value: string): void;
  (event: 'reset'): void;
  (event: 'export-pdf'): void;
  (event: 'export-png'): void;
  (event: 'print-paper'): void;
}>();

const selectedTemplateId = ref('default');
const dotGridTypes = GRID_TYPES.filter((gridType) => GRID_TYPES_WITH_DOTS.has(gridType));
const lineGridTypes = GRID_TYPES.filter((gridType) => !GRID_TYPES_WITH_DOTS.has(gridType));
const internationalStandardFormats = PAGE_FORMATS.filter((pageFormat) =>
  ['A2', 'A3', 'A4', 'A5'].includes(pageFormat),
);
const usPageFormats = PAGE_FORMATS.filter((pageFormat) =>
  ['Letter', 'Legal', 'Tabloid'].includes(pageFormat),
);
const archPageFormats = PAGE_FORMATS.filter((pageFormat) => pageFormat.startsWith('Arch'));
const otherPageFormats = PAGE_FORMATS.filter(
  (pageFormat) =>
    !internationalStandardFormats.includes(pageFormat) &&
    !usPageFormats.includes(pageFormat) &&
    !archPageFormats.includes(pageFormat),
);

function updateConfig<K extends keyof PaperConfig>(key: K, value: PaperConfig[K]): void {
  emit('update:config', {
    ...props.config,
    [key]: value,
  });
}

function updateNumber<K extends keyof PaperConfig>(key: K, value: string): void {
  updateConfig(key, Number(value) as PaperConfig[K]);
}

function updateBoolean<K extends keyof PaperConfig>(key: K, value: boolean): void {
  updateConfig(key, value as PaperConfig[K]);
}

function applyTemplate(value: string): void {
  selectedTemplateId.value = value;
  emit('apply-template', value);
}

function handleReset(): void {
  selectedTemplateId.value = 'default';
  emit('reset');
}

function formatValue(value: number): string {
  return formatMeasurement(value, 3);
}
</script>

<template>
  <aside class="controls-panel" aria-label="Paper controls">
    <section class="control-group">
      <div class="control-group__header">
        <div>
          <p class="control-group__eyebrow">Quick start</p>
          <h2 class="control-group__title">Templates</h2>
        </div>
        <button class="text-button" type="button" @click="handleReset">
          Reset to defaults
        </button>
      </div>

      <FormField
        for-id="template"
        label="Preset"
        hint="Start from a tuned layout, then make it your own."
      >
        <select
          id="template"
          class="control"
          :value="selectedTemplateId"
          @change="applyTemplate(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="template in templateOptions" :key="template.id" :value="template.id">
            {{ template.label }}
          </option>
        </select>
      </FormField>
    </section>

    <section class="control-group">
      <div class="control-group__header">
        <div>
          <p class="control-group__eyebrow">Grid settings</p>
          <h2 class="control-group__title">Pattern</h2>
        </div>
      </div>

      <FormField for-id="grid-type" label="Grid style">
        <select
          id="grid-type"
          class="control"
          :value="config.gridType"
          @change="updateConfig('gridType', ($event.target as HTMLSelectElement).value as PaperConfig['gridType'])"
        >
          <optgroup label="Dots">
            <option v-for="gridType in dotGridTypes" :key="gridType" :value="gridType">
              {{ GRID_TYPE_LABELS[gridType] }}
            </option>
          </optgroup>
          <optgroup label="Lines">
            <option v-for="gridType in lineGridTypes" :key="gridType" :value="gridType">
              {{ GRID_TYPE_LABELS[gridType] }}
            </option>
          </optgroup>
        </select>
      </FormField>

      <FormField for-id="unit" label="Measurement unit">
        <div class="segmented-control">
          <button
            v-for="unit in UNITS"
            :key="unit"
            class="segmented-control__item"
            :class="{ 'segmented-control__item--active': unit === config.unit }"
            type="button"
            @click="updateConfig('unit', unit)"
          >
            {{ UNIT_LABELS[unit] }}
          </button>
        </div>
      </FormField>

      <FormField
        for-id="cell-size"
        label="Cell size / spacing"
        hint="All geometry is normalized to millimeters internally for consistent export."
      >
        <template #meta>{{ formatValue(config.cellSize) }} {{ config.unit }}</template>
        <input
          id="cell-size"
          class="slider"
          type="range"
          :min="measurementRanges.cellSize.min"
          :max="measurementRanges.cellSize.max"
          :step="measurementRanges.cellSize.step"
          :value="config.cellSize"
          @input="updateNumber('cellSize', ($event.target as HTMLInputElement).value)"
        />
      </FormField>

      <FormField for-id="line-intensity" label="Intensity / opacity">
        <template #meta>{{ formatMeasurement(config.lineIntensity, 2) }}</template>
        <input
          id="line-intensity"
          class="slider"
          type="range"
          min="0.08"
          max="0.92"
          step="0.02"
          :value="config.lineIntensity"
          @input="updateNumber('lineIntensity', ($event.target as HTMLInputElement).value)"
        />
      </FormField>

      <FormField v-if="GRID_TYPES_WITH_DOTS.has(config.gridType)" for-id="dot-size" label="Dot size">
        <template #meta>{{ formatValue(config.dotSize) }} {{ config.unit }}</template>
        <input
          id="dot-size"
          class="slider"
          type="range"
          :min="measurementRanges.dotSize.min"
          :max="measurementRanges.dotSize.max"
          :step="measurementRanges.dotSize.step"
          :value="config.dotSize"
          @input="updateNumber('dotSize', ($event.target as HTMLInputElement).value)"
        />
      </FormField>

      <FormField v-else for-id="stroke-width" label="Stroke thickness">
        <template #meta>{{ formatValue(config.strokeWidth) }} {{ config.unit }}</template>
        <input
          id="stroke-width"
          class="slider"
          type="range"
          :min="measurementRanges.strokeWidth.min"
          :max="measurementRanges.strokeWidth.max"
          :step="measurementRanges.strokeWidth.step"
          :value="config.strokeWidth"
          @input="updateNumber('strokeWidth', ($event.target as HTMLInputElement).value)"
        />
      </FormField>

      <FormField
        v-if="GRID_TYPES_WITH_MAJOR_INTERVAL.has(config.gridType)"
        for-id="graph-major"
        :label="config.gridType === 'graph' ? 'Major line interval' : 'Major guide interval'"
      >
        <template #meta>Every {{ config.graphMajorEvery }} cells</template>
        <input
          id="graph-major"
          class="slider"
          type="range"
          min="2"
          max="8"
          step="1"
          :value="config.graphMajorEvery"
          @input="updateNumber('graphMajorEvery', ($event.target as HTMLInputElement).value)"
        />
      </FormField>
    </section>

    <section class="control-group">
      <div class="control-group__header">
        <div>
          <p class="control-group__eyebrow">Page settings</p>
          <h2 class="control-group__title">Sheet</h2>
        </div>
      </div>

      <FormField for-id="page-format" label="Page size">
        <select
          id="page-format"
          class="control"
          :value="config.pageFormat"
          @change="updateConfig('pageFormat', ($event.target as HTMLSelectElement).value as PaperConfig['pageFormat'])"
        >
          <optgroup label="International Standard">
            <option
              v-for="pageFormat in internationalStandardFormats"
              :key="pageFormat"
              :value="pageFormat"
            >
              {{ PAGE_FORMAT_DEFINITIONS[pageFormat].label }}
            </option>
          </optgroup>
          <optgroup label="Inch-based">
            <option v-for="pageFormat in usPageFormats" :key="pageFormat" :value="pageFormat">
              {{ PAGE_FORMAT_DEFINITIONS[pageFormat].label }}
            </option>
          </optgroup>
          <optgroup label="Architectural">
            <option v-for="pageFormat in archPageFormats" :key="pageFormat" :value="pageFormat">
              {{ PAGE_FORMAT_DEFINITIONS[pageFormat].label }}
            </option>
          </optgroup>
          <optgroup v-if="otherPageFormats.length > 0" label="Other">
            <option v-for="pageFormat in otherPageFormats" :key="pageFormat" :value="pageFormat">
              {{ PAGE_FORMAT_DEFINITIONS[pageFormat].label }}
            </option>
          </optgroup>
        </select>
      </FormField>

      <FormField for-id="orientation" label="Orientation">
        <div id="orientation" class="segmented-control">
          <button
            class="segmented-control__item"
            :class="{ 'segmented-control__item--active': !config.landscape }"
            type="button"
            @click="updateBoolean('landscape', false)"
          >
            Portrait
          </button>
          <button
            class="segmented-control__item"
            :class="{ 'segmented-control__item--active': config.landscape }"
            type="button"
            @click="updateBoolean('landscape', true)"
          >
            Landscape
          </button>
        </div>
      </FormField>

      <FormField for-id="margin" label="Margins">
        <select
          id="margin"
          class="control"
          :value="config.marginPreset"
          @change="updateConfig('marginPreset', ($event.target as HTMLSelectElement).value as PaperConfig['marginPreset'])"
        >
          <option v-for="margin in Object.keys(MARGIN_PRESET_LABELS)" :key="margin" :value="margin">
            {{ MARGIN_PRESET_LABELS[margin as keyof typeof MARGIN_PRESET_LABELS] }}
          </option>
        </select>
      </FormField>
    </section>

    <section class="control-group">
      <div class="control-group__header">
        <div>
          <p class="control-group__eyebrow">Miscellaneous</p>
          <h2 class="control-group__title">Details</h2>
        </div>
      </div>

      <label class="toggle">
        <input
          class="toggle__input"
          type="checkbox"
          :checked="config.showHeadingFields"
          @change="updateBoolean('showHeadingFields', ($event.target as HTMLInputElement).checked)"
        />
        <span class="toggle__text">Show heading / date fields</span>
      </label>

      <label class="toggle">
        <input
          class="toggle__input"
          type="checkbox"
          :checked="config.showPageTitleArea"
          @change="updateBoolean('showPageTitleArea', ($event.target as HTMLInputElement).checked)"
        />
        <span class="toggle__text">Show page title area</span>
      </label>

      <label class="toggle">
        <input
          class="toggle__input"
          type="checkbox"
          :checked="config.showCreditMark"
          @change="updateBoolean('showCreditMark', ($event.target as HTMLInputElement).checked)"
        />
        <span class="toggle__text">Credit Startling Papers in the page corner</span>
      </label>
    </section>

    <section class="control-group">
      <div class="control-group__header">
        <div>
          <p class="control-group__eyebrow">Export</p>
          <h2 class="control-group__title">Download</h2>
        </div>
      </div>

      <p class="control-group__description">
        Use actual size or 100% scaling when printing for the most accurate spacing.
      </p>

      <ExportButtons
        :is-exporting="isExporting"
        :can-export="canExport"
        :error="exportError"
        @export-pdf="$emit('export-pdf')"
        @export-png="$emit('export-png')"
        @print-paper="$emit('print-paper')"
      />
    </section>
  </aside>
</template>

<style scoped>
.controls-panel {
  display: grid;
  gap: 1rem;
}

.control-group {
  background: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.control-group__header {
  align-items: start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.control-group__eyebrow {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 0.35rem;
  text-transform: uppercase;
}

.control-group__title {
  color: var(--color-text-strong);
  font-size: 1.08rem;
  letter-spacing: -0.03em;
  margin: 0;
}

.control-group__description {
  color: var(--color-text);
  font-size: 0.88rem;
  line-height: 1.55;
  margin: 0;
}

.control,
.slider,
.segmented-control {
  width: 100%;
}

.control {
  appearance: none;
  background: var(--color-input-background);
  border: 1px solid var(--color-border-strong);
  border-radius: 0.9rem;
  color: var(--color-text-strong);
  font: inherit;
  min-height: 2.8rem;
  padding: 0.8rem 0.9rem;
}

.slider {
  accent-color: var(--color-accent);
}

.segmented-control {
  background: var(--color-input-soft-background);
  border: 1px solid var(--color-border-strong);
  border-radius: 1rem;
  display: flex;
  gap: 0.3rem;
  padding: 0.3rem;
}

.segmented-control__item {
  background: transparent;
  border: 0;
  border-radius: 0.8rem;
  color: var(--color-text);
  cursor: pointer;
  flex: 1 1 0;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  min-height: 2.55rem;
  padding: 0.5rem 0.75rem;
  transition: background-color 160ms ease, color 160ms ease, box-shadow 160ms ease;
}

.segmented-control__item--active {
  background: var(--color-input-active-background);
  box-shadow: inset 0 0 0 1px var(--color-input-active-ring);
  color: var(--color-text-strong);
}

.toggle {
  align-items: center;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  gap: 0.75rem;
  padding: 0.85rem 0.95rem;
}

.toggle__input {
  accent-color: var(--color-accent);
  block-size: 1rem;
  inline-size: 1rem;
  margin: 0;
}

.toggle__text {
  color: var(--color-text-strong);
  font-size: 0.92rem;
  font-weight: 600;
}

.text-button {
  background: transparent;
  border: 0;
  color: var(--color-accent);
  cursor: pointer;
  font: inherit;
  font-size: 0.86rem;
  font-weight: 700;
  padding: 0;
}

@media (max-width: 640px) {
  .control-group__header {
    align-items: stretch;
    flex-direction: column;
  }

  .segmented-control {
    flex-direction: column;
  }
}
</style>
