export const EQUATE = 'EQUATE';
export const ADD = 'ADD';
export const SUBTRACT = 'SUBTRACT';
export const MULTIPLY = 'MULTIPLY';
export const DIVIDE = 'DIVIDE';
export const NEGATE = 'NEGATE';
export const EXPONENT = 'EXPONENT';

export const orderOperations = {
  [EQUATE]: 0,
  [ADD]: 1,
  [SUBTRACT]: 1,
  [MULTIPLY]: 2,
  [DIVIDE]: 2,
  [NEGATE]: 3,
  [EXPONENT]: 3,
};

export const operationsOrder = pipe(
  invert,
  toPairs,
  sortBy(head),
  map(last)
)(orderOperations);

export const orderDirection = {
  [orderOperations[EQUATE]]: 'forwards',
  [orderOperations[ADD]]: 'forwards',
  [orderOperations[MULTIPLY]]: 'forwards',
  [orderOperations[EXPONENT]]: 'backwards',
};
