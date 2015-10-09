import { color } from '../types';

export function add(context, lhs, rhs) {
  return { ...color, value: lhs.value.add(rhs.value) };
}

export function subtract(context, lhs, rhs) {
  return { ...color, value: lhs.value.subtract(rhs.value) };
}

export function multiply(context, lhs, rhs) {
  return { ...color, value: lhs.value.multiply(rhs.value) };
}

export function divide(context, lhs, rhs) {
  return { ...color, value: lhs.value.divide(rhs.value) };
}
