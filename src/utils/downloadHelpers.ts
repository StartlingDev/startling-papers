export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 500);
}

export function svgMarkupToBlob(svgMarkup: string): Blob {
  return new Blob([svgMarkup], {
    type: 'image/svg+xml;charset=utf-8',
  });
}
