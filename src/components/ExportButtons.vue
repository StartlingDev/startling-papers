<script setup lang="ts">
defineProps<{
  isExporting: boolean;
  canExport: boolean;
  error: string | null;
}>();

defineEmits<{
  (event: 'export-pdf'): void;
  (event: 'export-png'): void;
  (event: 'print-paper'): void;
}>();
</script>

<template>
  <div class="export-buttons">
    <div class="export-buttons__actions">
      <button
        class="button button--primary"
        type="button"
        :disabled="!canExport"
        @click="$emit('export-pdf')"
      >
        {{ isExporting ? 'Exporting…' : 'Download PDF' }}
      </button>
      <button
        class="button button--secondary"
        type="button"
        :disabled="!canExport"
        @click="$emit('export-png')"
      >
        Download PNG
      </button>
    </div>
    <div class="export-buttons__print">
      <p class="export-buttons__label">Print</p>
      <button
        class="button button--secondary export-buttons__print-button"
        type="button"
        :disabled="!canExport"
        @click="$emit('print-paper')"
      >
        Print Paper
      </button>
    </div>
    <p v-if="error" class="export-buttons__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.export-buttons {
  display: grid;
  gap: 0.8rem;
}

.export-buttons__actions {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.export-buttons__print {
  display: grid;
  gap: 0.55rem;
}

.export-buttons__label {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0;
  text-transform: uppercase;
}

.export-buttons__print-button {
  width: 100%;
}

.export-buttons__error {
  color: var(--color-danger);
  font-size: 0.84rem;
  margin: 0;
}

@media (max-width: 480px) {
  .export-buttons__actions {
    grid-template-columns: 1fr;
  }
}
</style>
