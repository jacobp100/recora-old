import { entity } from '../types/descriptors';
import * as entityMath from './entity';


const negativeEntity = { ...entity, value: -1 };

const addValueMap = {
  ENTITY: {
    ENTITY: entityMath.add,
  },
};
const subtractValueMap = {
  ENTITY: {
    ENTITY: entityMath.subtract,
  },
};
const multiplyValueMap = {
  ENTITY: {
    ENTITY: entityMath.multiply,
  },
};
const divideValueMap = {
  ENTITY: {
    ENTITY: entityMath.divide,
  },
};
const negateValueMap = {
  EMPTY: {
    ENTITY: (context, lhs, rhs) => entityMath.multiply(context, negativeEntity, rhs),
  },
};
const exponentValueMap = {
  ENTITY: {
    ENTITY: entityMath.exponent,
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
export const NEGATE = createOperation(negateValueMap);
export const EXPONENT = createOperation(exponentValueMap);
