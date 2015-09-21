export const mathOperations = {
  EQUATE: 'EQUATE',
  ADD: 'ADD',
  SUBTRACT: 'SUBTRACT',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
  EXPONENT: 'EXPONENT',
};

export const orderOperations = {
  [mathOperations.EQUATE]: 0,
  [mathOperations.ADD]: 1,
  [mathOperations.SUBTRACT]: 1,
  [mathOperations.MULTIPLY]: 2,
  [mathOperations.DIVIDE]: 2,
  [mathOperations.EXPONENT]: 3,
};

export const operationsOrder = [
  [mathOperations.EQUATE],
  [mathOperations.ADD, mathOperations.SUBTRACT],
  [mathOperations.MULTIPLY, mathOperations.DIVIDE],
  [mathOperations.EXPONENT],
];
