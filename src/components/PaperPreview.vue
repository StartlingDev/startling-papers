<script setup lang="ts">
import { computed } from 'vue';
import { formatMeasurement } from '@/utils/unitConversion';

const props = defineProps<{
  svgMarkup: string;
  pageWidthMm: number;
  pageHeightMm: number;
  pageLabel: string;
  orientationLabel: string;
}>();

const pageAspectRatio = computed(() => `${props.pageWidthMm} / ${props.pageHeightMm}`);
const pageSizeLabel = computed(
  () =>
    `${formatMeasurement(props.pageWidthMm, 1)} × ${formatMeasurement(props.pageHeightMm, 1)} mm`,
);
</script>

<template>
  <section class="preview-card" aria-labelledby="preview-title">
    <div class="preview-card__header">
      <div>
        <p class="preview-card__eyebrow">Live preview</p>
        <h2 id="preview-title" class="preview-card__title">Rendered page</h2>
      </div>
      <div class="preview-card__meta">
        <span class="preview-chip">{{ pageLabel }}</span>
        <span class="preview-chip">{{ orientationLabel }}</span>
        <span class="preview-chip">{{ pageSizeLabel }}</span>
      </div>
    </div>

    <div class="preview-card__surface">
      <div class="preview-canvas">
        <div
          class="preview-page"
          :style="{ aspectRatio: pageAspectRatio }"
          v-html="svgMarkup"
        />
      </div>
    </div>

    <p class="preview-card__note">
      Preview scaling is adaptive for screen size. Exported files preserve the selected
      page proportions.
    </p>
  </section>
</template>

<style scoped>
.preview-card {
  background: linear-gradient(
    180deg,
    var(--color-preview-card-top),
    var(--color-preview-card-bottom)
  );
  border: 1px solid var(--color-border-strong);
  border-radius: 1.5rem;
  display: grid;
  gap: 1.2rem;
  padding: 1.25rem;
}

.preview-card__header {
  display: grid;
  gap: 0.9rem;
}

.preview-card__eyebrow {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 0.4rem;
  text-transform: uppercase;
}

.preview-card__title {
  color: var(--color-text-strong);
  font-size: 1.25rem;
  letter-spacing: -0.03em;
  margin: 0;
}

.preview-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.preview-chip {
  background: var(--color-chip-background);
  border: 1px solid var(--color-chip-border);
  border-radius: 999px;
  color: var(--color-text);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.4rem 0.68rem;
}

.preview-card__surface {
  background:
    radial-gradient(circle at top, var(--color-preview-surface-radial), transparent 48%),
    linear-gradient(
      180deg,
      var(--color-preview-surface-start),
      var(--color-preview-surface-end)
    );
  border: 1px solid var(--color-preview-surface-border);
  border-radius: 1.25rem;
  padding: 1rem;
}

.preview-canvas {
  display: grid;
  min-height: min(74vh, 48rem);
  place-items: center;
}

.preview-page {
  filter: drop-shadow(var(--shadow-paper));
  max-height: 100%;
  max-width: 100%;
  width: min(100%, 46rem);
}

.preview-page :deep(svg) {
  display: block;
  height: 100%;
  width: 100%;
}

.preview-card__note {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
}
</style>
