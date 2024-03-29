import { pipe, invert, toPairs, sortBy, head, map, last } from 'ramda';
export const EQUATE = 'EQUATE';
export const ADD = 'ADD';
export const SUBTRACT = 'SUBTRACT';
export const MULTIPLY = 'MULTIPLY';
export const MULTIPLY_COND_DIMENSIONS_LENGTH_ONLY = 'MULTIPLY_COND_DIMENSIONS_LENGTH_ONLY';
export const DIVIDE = 'DIVIDE';
export const NEGATE = 'NEGATE';
export const EXPONENT = 'EXPONENT';
export const FACTORIAL = 'FACTORIAL';

const operationLevels = {
  EQUATE: 0,
  ADD_SUBTRACT: 1,
  MULTIPLY_DIVIDE: 2,
  MISC_1: 3,
  EXPONENT_NEGATE: 4,
  FACTORIAL: 5,
};

export const orderOperations = {
  [EQUATE]: operationLevels.EQUATE,
  [ADD]: operationLevels.ADD_SUBTRACT,
  [SUBTRACT]: operationLevels.ADD_SUBTRACT,
  [MULTIPLY]: operationLevels.MULTIPLY_DIVIDE,
  [DIVIDE]: operationLevels.MULTIPLY_DIVIDE,
  [MULTIPLY_COND_DIMENSIONS_LENGTH_ONLY]: operationLevels.MISC_1,
  [EXPONENT]: operationLevels.EXPONENT_NEGATE,
  [NEGATE]: operationLevels.EXPONENT_NEGATE,
  [FACTORIAL]: operationLevels.FACTORIAL,
};

export const operationsOrder = pipe(
  invert,
  toPairs,
  sortBy(head),
  map(last)
)(orderOperations);

export const orderDirection = {
  [operationLevels.EQUATE]: 'forwards',
  [operationLevels.ADD_SUBTRACT]: 'forwards',
  [operationLevels.MULTIPLY_DIVIDE]: 'forwards',
  [operationLevels.MISC_1]: 'forwards',
  [operationLevels.EXPONENT_NEGATE]: 'backwards',
  [operationLevels.FACTORIAL]: 'backwards',
};

export const unaryOperators = [
  NEGATE,
  FACTORIAL,
];
