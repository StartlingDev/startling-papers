# Startling Papers

A polished Vue 3 + TypeScript + Vite web app for generating printable paper layouts with a live SVG preview and downloadable PDF/PNG exports.

[View App](https://startlingdev.github.io/startling-papers)

## Features

- Live SVG preview that preserves the selected page proportions
- Paper styles:
  - Square
  - Dot grid
  - Guide dots
  - Staggered dots
  - Diamond dots
  - Isometric dots
  - Triangle grid
  - Isometric
  - Pseudo-isometric (1:2)
  - Rhombus
  - Hexagons
  - Graph paper
  - Horizontal lines
- Measurement units in `mm`, `cm`, and `in`
- Page formats including A-series, US formats, Arch sizes, and PA4
- Margin presets, portrait/landscape orientation, optional heading/date/title area
- PDF export via `pdf-lib`
- PNG export using browser canvas APIs
- Local preset templates, localStorage persistence, shareable URL query params, and reset-to-defaults

## Setup

```bash
npm install
npm run dev
```

Open the local Vite URL in your browser.

## Scripts

- `npm run dev` starts the development server
- `npm run build` runs `vue-tsc` and creates a production bundle
- `npm run preview` serves the production build locally
- `npm run test` starts Vitest in watch mode
- `npm run test:run` runs the test suite once

## Architecture

The app keeps all layout math in millimeters internally, even when the UI is working in centimeters or inches. That makes the preview pipeline, renderer logic, and exports deterministic.

### Rendering flow

1. Resolve the page dimensions from the selected paper format and orientation.
2. Convert user measurements to millimeters.
3. Apply the chosen margin preset to get the drawable content area.
4. Reserve optional heading/title space.
5. Render the selected pattern into an SVG clipped to the printable region.
6. Reuse the same SVG for preview and export.

### Notes

- Renderers are isolated pure functions that accept normalized configuration and return SVG fragments.
- UI components stay thin and defer state normalization, persistence, and export logic to composables.
- The preview uses a responsive `viewBox`, while exports keep the real page dimensions.

## Testing

The included unit tests cover:

- unit conversion
- page format resolution
- margin and content-area calculations
- geometry helpers used by the renderers

Run them with:

```bash
npm run test:run
```

## Future improvements

- true vector PDF embedding for the full SVG markup
- per-grid advanced controls such as graph major/minor color tuning
- user-managed preset save/load collections
- print calibration helpers for specific printers
- broader renderer-focused test coverage

## License

MIT. See [LICENSE](/Users/nutch/dev/codex/startling-papers/LICENSE).
