export const mathOperations = {
  EQUATE: 'EQUATE',
  ADD: 'ADD',
  SUBTRACT: 'SUBTRACT',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
  NEGATE: 'NEGATE',
  EXPONENT: 'EXPONENT',
};

export const orderOperations = {
  [mathOperations.EQUATE]: 0,
  [mathOperations.ADD]: 1,
  [mathOperations.SUBTRACT]: 1,
  [mathOperations.MULTIPLY]: 2,
  [mathOperations.DIVIDE]: 2,
  [mathOperations.NEGATE]: 3,
  [mathOperations.EXPONENT]: 4,
};

export const operationsOrder = pipe(
  toPairs,
  groupBy(last),
  values,
  sortBy(pipe(head, last)),
  map(map(head))
)(orderOperations);
