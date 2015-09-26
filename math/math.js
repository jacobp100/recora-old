import entityMath from './entity';


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
  const fn = path([lhs.value, rhs.value], valueMap);
  return fn ? fn(context, lhs, rhs) : null;
};

export const add = createOperation(addValueMap);
export const subtract = createOperation(subtractValueMap);
export const multiply = createOperation(multiplyValueMap);
export const divide = createOperation(divideValueMap);
export const exponent = createOperation(exponentValueMap);
