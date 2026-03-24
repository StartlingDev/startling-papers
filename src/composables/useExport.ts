import { computed, ref } from 'vue';
import type { PaperRenderResult } from '@/composables/usePaperRenderer';
import { downloadBlob, svgMarkupToBlob } from '@/utils/downloadHelpers';
import { millimetersToPoints } from '@/utils/unitConversion';

const EXPORT_DPI = 220;
const MAX_EXPORT_EDGE_PX = 5200;

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load the rendered SVG for export.'));
    image.src = url;
  });
}

async function rasterizeSvg(
  result: PaperRenderResult,
  backgroundColor = '#ffffff',
): Promise<Blob> {
  const svgBlob = svgMarkupToBlob(result.svgMarkup);
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(svgUrl);
    const pixelsPerMillimeter = EXPORT_DPI / 25.4;
    const widthPx = result.normalizedConfig.pageWidthMm * pixelsPerMillimeter;
    const heightPx = result.normalizedConfig.pageHeightMm * pixelsPerMillimeter;
    const scale = Math.min(1, MAX_EXPORT_EDGE_PX / Math.max(widthPx, heightPx));
    const canvas = document.createElement('canvas');

    canvas.width = Math.round(widthPx * scale);
    canvas.height = Math.round(heightPx * scale);

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas rendering is not available in this browser.');
    }

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Unable to encode PNG export.'));
          return;
        }

        resolve(blob);
      }, 'image/png');
    });

    return pngBlob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function buildPrintDocument(result: PaperRenderResult): string {
  const { pageWidthMm, pageHeightMm } = result.normalizedConfig;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Print ${result.filenameBase}</title>
    <style>
      @page {
        size: ${pageWidthMm}mm ${pageHeightMm}mm;
        margin: 0;
      }

      :root {
        color-scheme: light only;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        background: #dfe7ed;
        display: grid;
        min-height: 100vh;
        place-items: center;
      }

      .print-page {
        background: #ffffff;
        height: ${pageHeightMm}mm;
        width: ${pageWidthMm}mm;
      }

      .print-page svg {
        display: block;
        height: 100%;
        width: 100%;
      }

      @media print {
        body {
          background: #ffffff;
          min-height: auto;
        }
      }
    </style>
  </head>
  <body>
    <div class="print-page">${result.svgMarkup}</div>
  </body>
</html>`;
}

export function useExport(renderedPaper: () => PaperRenderResult) {
  const isExporting = ref(false);
  const exportError = ref<string | null>(null);
  const canExport = computed(() => !isExporting.value);

  async function exportPng(): Promise<void> {
    isExporting.value = true;
    exportError.value = null;

    try {
      const result = renderedPaper();
      const blob = await rasterizeSvg(result);
      downloadBlob(blob, `${result.filenameBase}.png`);
    } catch (error) {
      exportError.value = error instanceof Error ? error.message : 'PNG export failed.';
    } finally {
      isExporting.value = false;
    }
  }

  async function exportPdf(): Promise<void> {
    isExporting.value = true;
    exportError.value = null;

    try {
      const { PDFDocument } = await import('pdf-lib');
      const result = renderedPaper();
      const pngBlob = await rasterizeSvg(result);
      const pngBytes = await pngBlob.arrayBuffer();
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([
        millimetersToPoints(result.normalizedConfig.pageWidthMm),
        millimetersToPoints(result.normalizedConfig.pageHeightMm),
      ]);
      const embeddedPng = await pdf.embedPng(pngBytes);
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();

      page.drawImage(embeddedPng, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });

      const pdfBytes = await pdf.save();
      const pdfBuffer = new Uint8Array(pdfBytes).buffer;
      downloadBlob(
        new Blob([pdfBuffer], { type: 'application/pdf' }),
        `${result.filenameBase}.pdf`,
      );
    } catch (error) {
      exportError.value = error instanceof Error ? error.message : 'PDF export failed.';
    } finally {
      isExporting.value = false;
    }
  }

  function printPaper(): void {
    exportError.value = null;

    try {
      const result = renderedPaper();
      const iframe = document.createElement('iframe');

      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.blockSize = '0';
      iframe.style.border = '0';
      iframe.style.inlineSize = '0';
      iframe.style.inset = 'auto 0 0 auto';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      iframe.style.position = 'fixed';

      const cleanup = (): void => {
        window.setTimeout(() => {
          iframe.remove();
        }, 250);
      };

      iframe.addEventListener('load', () => {
        const frameWindow = iframe.contentWindow;

        if (!frameWindow) {
          exportError.value = 'Unable to prepare the print view.';
          cleanup();
          return;
        }

        const handleAfterPrint = (): void => {
          frameWindow.removeEventListener('afterprint', handleAfterPrint);
          cleanup();
        };

        frameWindow.addEventListener('afterprint', handleAfterPrint);

        window.setTimeout(() => {
          try {
            frameWindow.focus();
            frameWindow.print();
          } catch {
            exportError.value = 'Unable to start printing in this browser.';
            cleanup();
          }
        }, 80);
      }, { once: true });

      document.body.append(iframe);
      iframe.srcdoc = buildPrintDocument(result);
    } catch (error) {
      exportError.value = error instanceof Error ? error.message : 'Print setup failed.';
    }
  }

  return {
    isExporting,
    exportError,
    canExport,
    exportPdf,
    exportPng,
    printPaper,
  };
}
