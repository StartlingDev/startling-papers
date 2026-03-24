export const APP_THEME_IDS = [
  'paper-light',
  'blueprint-light',
  'linen-light',
  'midnight-dark',
  'ink-dark',
  'forest-dark',
] as const;

export type AppThemeId = (typeof APP_THEME_IDS)[number];
export type AppThemeMode = 'light' | 'dark';

export interface AppThemeOption {
  id: AppThemeId;
  label: string;
  mode: AppThemeMode;
}

export const DEFAULT_APP_THEME: AppThemeId = 'ink-dark';

export const APP_THEMES: AppThemeOption[] = [
  { id: 'paper-light', label: 'Paper Light', mode: 'light' },
  { id: 'blueprint-light', label: 'Blueprint Light', mode: 'light' },
  { id: 'linen-light', label: 'Linen Light', mode: 'light' },
  { id: 'midnight-dark', label: 'Midnight Dark', mode: 'dark' },
  { id: 'ink-dark', label: 'Ink Dark', mode: 'dark' },
  { id: 'forest-dark', label: 'Forest Dark', mode: 'dark' },
];

export function isAppThemeId(value: string): value is AppThemeId {
  return APP_THEME_IDS.includes(value as AppThemeId);
}
