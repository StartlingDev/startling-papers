<script setup lang="ts">
defineProps<{
  label: string;
  forId: string;
  hint?: string;
}>();
</script>

<template>
  <div class="form-field">
    <div class="form-field__top">
      <label class="form-field__label" :for="forId">{{ label }}</label>
      <div v-if="$slots.meta" class="form-field__meta">
        <slot name="meta" />
      </div>
    </div>
    <p v-if="hint" class="form-field__hint">{{ hint }}</p>
    <div class="form-field__control">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.form-field {
  display: grid;
  gap: 0.55rem;
}

.form-field__top {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
}

.form-field__label {
  color: var(--color-text-strong);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.form-field__meta {
  color: var(--color-text);
  font-size: 0.84rem;
  font-variant-numeric: tabular-nums;
}

.form-field__hint {
  color: var(--color-text-muted);
  font-size: 0.83rem;
  line-height: 1.45;
  margin: 0;
}

.form-field__control {
  min-width: 0;
}
</style>
