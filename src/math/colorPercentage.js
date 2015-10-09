import { lighten, darken } from '../types/color';

export function add(context, color, percentage) {
  return lighten(context, color, percentage.value / 100);
}

export function subtract(context, color, percentage) {
  return darken(context, color, percentage.value / 100);
}
