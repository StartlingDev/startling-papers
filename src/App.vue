<script setup lang="ts">
import { computed } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import ControlsPanel from '@/components/ControlsPanel.vue';
import { useAppTheme } from '@/composables/useAppTheme';
import PaperPreview from '@/components/PaperPreview.vue';
import { useExport } from '@/composables/useExport';
import { usePaperConfig } from '@/composables/usePaperConfig';
import { usePaperRenderer } from '@/composables/usePaperRenderer';
import { PAGE_FORMAT_DEFINITIONS } from '@/models/paperFormats';

useAppTheme();
const { config, measurementRanges, templateOptions, setConfig, applyTemplate, reset } =
  usePaperConfig();
const { renderedPaper } = usePaperRenderer(config);
const { isExporting, exportError, canExport, exportPdf, exportPng, printPaper } = useExport(
  () => renderedPaper.value,
);

const orientationLabel = computed(() =>
  config.value.landscape ? 'Landscape' : 'Portrait',
);

const pageLabel = computed(
  () => PAGE_FORMAT_DEFINITIONS[config.value.pageFormat].label,
);
</script>

<template>
  <div class="app-shell">
    <div class="app-shell__inner">
      <AppHeader />

      <main class="workspace">
        <ControlsPanel
          class="workspace__controls"
          :config="config"
          :measurement-ranges="measurementRanges"
          :template-options="templateOptions"
          :is-exporting="isExporting"
          :can-export="canExport"
          :export-error="exportError"
          @update:config="setConfig"
          @apply-template="applyTemplate"
          @reset="reset"
          @export-pdf="exportPdf"
          @export-png="exportPng"
          @print-paper="printPaper"
        />

        <PaperPreview
          class="workspace__preview"
          :svg-markup="renderedPaper.previewSvgMarkup"
          :page-width-mm="renderedPaper.normalizedConfig.pageWidthMm"
          :page-height-mm="renderedPaper.normalizedConfig.pageHeightMm"
          :page-label="pageLabel"
          :orientation-label="orientationLabel"
        />
      </main>

      <footer class="app-footer">
        Print at actual size with browser scaling disabled for the most faithful paper
        dimensions. Exported PDFs and PNGs always use a white sheet background.
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  padding: 1.5rem 1.25rem 1rem;
}

.app-shell__inner {
  display: grid;
  gap: 1rem;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: 100%;
  margin: 0 auto;
  max-width: 94rem;
}

.workspace {
  align-items: stretch;
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(19rem, 25rem) minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
}

.workspace__controls {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 0.35rem;
  scrollbar-gutter: stable;
}

.workspace__preview {
  min-height: 0;
  min-width: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 0.35rem;
  scrollbar-gutter: stable;
}

.workspace__controls::-webkit-scrollbar {
  width: 0.65rem;
}

.workspace__controls::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.workspace__controls::-webkit-scrollbar-track {
  background: transparent;
}

.workspace__preview::-webkit-scrollbar {
  width: 0.65rem;
}

.workspace__preview::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar-muted);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.workspace__preview::-webkit-scrollbar-track {
  background: transparent;
}

.app-footer {
  color: var(--color-text-muted);
  font-size: 0.88rem;
  line-height: 1.35;
  padding-block: 0.1rem;
}

@media (max-width: 980px) {
  .app-shell {
    height: auto;
    overflow: visible;
  }

  .app-shell__inner {
    height: auto;
  }

  .workspace {
    grid-template-columns: 1fr;
    overflow: visible;
  }

  .workspace__controls {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }

  .workspace__preview {
    overflow: visible;
    padding-right: 0;
  }
}
</style>
