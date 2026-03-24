export type SvgAttrValue = boolean | number | string | undefined;
export type SvgAttrs = Record<string, SvgAttrValue>;

export function formatSvgNumber(value: number): string {
  return Number(value.toFixed(3)).toString();
}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function attrsToString(attrs: SvgAttrs): string {
  return Object.entries(attrs)
    .filter((entry): entry is [string, Exclude<SvgAttrValue, undefined | false>] => {
      const [, value] = entry;
      return value !== undefined && value !== false;
    })
    .map(([key, value]) => {
      if (value === true) {
        return key;
      }

      return `${key}="${escapeXml(String(value))}"`;
    })
    .join(' ');
}

function tag(name: string, attrs: SvgAttrs, content?: string): string {
  const attrString = attrsToString(attrs);

  if (content === undefined) {
    return attrString ? `<${name} ${attrString} />` : `<${name} />`;
  }

  return attrString
    ? `<${name} ${attrString}>${content}</${name}>`
    : `<${name}>${content}</${name}>`;
}

export function rect(
  x: number,
  y: number,
  width: number,
  height: number,
  attrs: SvgAttrs = {},
): string {
  return tag('rect', {
    x: formatSvgNumber(x),
    y: formatSvgNumber(y),
    width: formatSvgNumber(width),
    height: formatSvgNumber(height),
    ...attrs,
  });
}

export function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  attrs: SvgAttrs = {},
): string {
  return tag('line', {
    x1: formatSvgNumber(x1),
    y1: formatSvgNumber(y1),
    x2: formatSvgNumber(x2),
    y2: formatSvgNumber(y2),
    ...attrs,
  });
}

export function circle(
  cx: number,
  cy: number,
  radius: number,
  attrs: SvgAttrs = {},
): string {
  return tag('circle', {
    cx: formatSvgNumber(cx),
    cy: formatSvgNumber(cy),
    r: formatSvgNumber(radius),
    ...attrs,
  });
}

export function polygon(
  points: Array<{ x: number; y: number }>,
  attrs: SvgAttrs = {},
): string {
  const value = points
    .map((point) => `${formatSvgNumber(point.x)},${formatSvgNumber(point.y)}`)
    .join(' ');

  return tag('polygon', {
    points: value,
    ...attrs,
  });
}

export function path(d: string, attrs: SvgAttrs = {}): string {
  return tag('path', {
    d,
    ...attrs,
  });
}

export function text(
  x: number,
  y: number,
  value: string,
  attrs: SvgAttrs = {},
): string {
  return tag(
    'text',
    {
      x: formatSvgNumber(x),
      y: formatSvgNumber(y),
      ...attrs,
    },
    escapeXml(value),
  );
}

export function group(content: string, attrs: SvgAttrs = {}): string {
  return tag('g', attrs, content);
}
