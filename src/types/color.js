export function lighten(context, color, value) {
  return { ...color, value: color.value.lighten(value) };
}
export function darken(context, color, value) {
  return { ...color, value: color.value.darken(value) };
}

export function convert(context, color, units) {
  const unitKeys = keys(units);
  const unitName = head(unitKeys);
  const unitValue = context.getUnitValue(unitName);

  if (length(unitKeys) === 1 && unitValue && unitValue.type === '_color') {
    return { ...color, colorSpace: unitName };
  }

  return null;
}

function rgbFormat(color) {
  const [r, g, b] = map(Math.round, color.values);
  return `rgb(${r}, ${g}, ${b})`;
}

function hslFormat(color) {
  const [h, s, l] = map(Math.round, color.values);
  return `hsl(${h}°, ${s}%, ${l}%)`;
}

export function toString(context, color) {
  const { colorSpace, value } = color;

  if (!colorSpace) {
    return value.toHex();
  }

  const convertedValue = value.convert(colorSpace);

  switch (colorSpace) {
  case 'rgb':
    return rgbFormat(convertedValue);
  case 'hsl':
    return hslFormat(convertedValue);
  default:
    return convertedValue.toString();
  }
}
