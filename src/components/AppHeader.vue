<template>
  <header class="app-header">
    <div class="app-header__brand">
      <img
        class="app-header__logo"
        src="https://avatars.githubusercontent.com/u/5158410?s=400&u=fef0afda1c3590556cee888069f225c827a16fd5&v=4"
        alt="Startling Development logo"
      />
      <h1 class="app-header__title">Startling Papers - Printable Paper Generator</h1>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: block;
}

.app-header__brand {
  align-items: center;
  display: flex;
  gap: 0.95rem;
}

.app-header__logo {
  background: var(--color-surface);
  block-size: clamp(3rem, 5vw, 3.75rem);
  border: 1px solid var(--color-border-strong);
  border-radius: 1rem;
  box-shadow: var(--shadow-panel);
  flex: 0 0 auto;
  inline-size: clamp(3rem, 5vw, 3.75rem);
  object-fit: cover;
  padding: 0.22rem;
}

.app-header__title {
  color: var(--color-text-strong);
  font-size: clamp(1.7rem, 3.2vw, 2.5rem);
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin: 0;
}

@media (max-width: 640px) {
  .app-header__brand {
    align-items: flex-start;
  }

  .app-header__logo {
    block-size: 2.8rem;
    border-radius: 0.9rem;
    inline-size: 2.8rem;
  }
}
</style>
