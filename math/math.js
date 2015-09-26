import * as entityMath from './entity';


const addValueMap = {
  'ENTITY': {
    'ENTITY': entityMath.add,
  },
};
const subtractValueMap = {
  'ENTITY': {
    'ENTITY': entityMath.subtract,
  },
};
const multiplyValueMap = {
  'ENTITY': {
    'ENTITY': entityMath.multiply,
  },
};
const divideValueMap = {
  'ENTITY': {
    'ENTITY': entityMath.divide,
  },
};
const exponentValueMap = {
  'ENTITY': {
    'ENTITY': entityMath.exponent,
  },
};

const createOperation = (valueMap) => (context, lhs, rhs) => {
  const fn = path([lhs.type, rhs.type], valueMap);
  return fn ? fn(context, lhs, rhs) : null;
};

export const ADD = createOperation(addValueMap);
export const SUBTRACT = createOperation(subtractValueMap);
export const MULTIPLY = createOperation(multiplyValueMap);
export const DIVIDE = createOperation(divideValueMap);
export const EXPONENT = createOperation(exponentValueMap);
