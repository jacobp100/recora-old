import { keys, head, map, length } from 'ramda';
import { getUnitValue } from '../environment';

export function lighten(context, color, value) {
  return { ...color, value: color.value.lighten(value) };
}
export function darken(context, color, value) {
  return { ...color, value: color.value.darken(value) };
}

export function channelMultiply(context, color, value) {
  return { ...color, value: color.value.channelMultiply(value) };
}

export function exponent(context, color, value) {
  return { ...color, value: color.value.exponent(value) };
}

export function convert(context, units, color) {
  const unitKeys = keys(units);
  const unitName = head(unitKeys);
  const unitValue = getUnitValue(context, unitName);

  if (length(unitKeys) === 1 && units[unitName] === 1 && unitValue && unitValue.type === '_color') {
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
      return convertedValue.toHex();
  }
}
