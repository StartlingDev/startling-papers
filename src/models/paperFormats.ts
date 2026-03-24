export const PAGE_FORMATS = [
  'A2',
  'A3',
  'A4',
  'A5',
  'Letter',
  'Legal',
  'Tabloid',
  'ArchA',
  'ArchB',
  'ArchC',
  'PA4',
] as const;

export type PageFormat = (typeof PAGE_FORMATS)[number];

export interface PageFormatDefinition {
  label: string;
  widthMm: number;
  heightMm: number;
}

export const PAGE_FORMAT_DEFINITIONS: Record<PageFormat, PageFormatDefinition> = {
  A2: { label: 'A2', widthMm: 420, heightMm: 594 },
  A3: { label: 'A3', widthMm: 297, heightMm: 420 },
  A4: { label: 'A4', widthMm: 210, heightMm: 297 },
  A5: { label: 'A5', widthMm: 148, heightMm: 210 },
  Letter: { label: 'Letter', widthMm: 215.9, heightMm: 279.4 },
  Legal: { label: 'Legal', widthMm: 215.9, heightMm: 355.6 },
  Tabloid: { label: 'Tabloid', widthMm: 279.4, heightMm: 431.8 },
  ArchA: { label: 'Arch A', widthMm: 228.6, heightMm: 304.8 },
  ArchB: { label: 'Arch B', widthMm: 304.8, heightMm: 457.2 },
  ArchC: { label: 'Arch C', widthMm: 457.2, heightMm: 609.6 },
  PA4: { label: 'PA4', widthMm: 210, heightMm: 280 },
};

export interface ResolvedPageSize {
  widthMm: number;
  heightMm: number;
}

export function resolvePageSize(
  pageFormat: PageFormat,
  landscape = false,
): ResolvedPageSize {
  const { widthMm, heightMm } = PAGE_FORMAT_DEFINITIONS[pageFormat];

  return landscape
    ? { widthMm: heightMm, heightMm: widthMm }
    : { widthMm, heightMm };
}
