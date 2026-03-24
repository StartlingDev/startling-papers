import { ref, watch } from 'vue';
import {
  APP_THEMES,
  DEFAULT_APP_THEME,
  isAppThemeId,
  type AppThemeId,
} from '@/models/appThemes';

const STORAGE_KEY = 'printable-paper-studio.theme';

function getThemeMode(themeId: AppThemeId): 'light' | 'dark' {
  return APP_THEMES.find((theme) => theme.id === themeId)?.mode ?? 'light';
}

function applyTheme(themeId: AppThemeId): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dataset.theme = themeId;
  document.documentElement.style.colorScheme = getThemeMode(themeId);
}

function loadInitialTheme(): AppThemeId {
  if (typeof window === 'undefined') {
    return DEFAULT_APP_THEME;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (storedTheme && isAppThemeId(storedTheme)) {
    return storedTheme;
  }

  return DEFAULT_APP_THEME;
}

export function useAppTheme() {
  const selectedTheme = ref<AppThemeId>(loadInitialTheme());

  watch(
    selectedTheme,
    (themeId) => {
      applyTheme(themeId);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, themeId);
      }
    },
    { immediate: true },
  );

  function setTheme(themeId: AppThemeId): void {
    selectedTheme.value = themeId;
  }

  return {
    selectedTheme,
    setTheme,
  };
}
