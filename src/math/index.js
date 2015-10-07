import { entity, empty } from '../types';
import * as entityMath from './entity';


const negativeEntity = { ...entity, value: -1 };

const addValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.add,
  },
};
const subtractValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.subtract,
  },
};
const multiplyValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.multiply,
  },
};
const multiplyCondDimensionsLength1 = {
  [entity.type]: {
    [entity.type]: entityMath.multiplyCondDimensionsLength1,
  },
};
const divideValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.divide,
  },
};
const negateValueMap = {
  [empty.type]: {
    [entity.type]: (context, lhs, rhs) => entityMath.multiply(context, negativeEntity, rhs),
  },
};
const exponentValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.exponent,
  },
};

const createOperation = (valueMap) => (context, lhs, rhs) => {
  const fn = path([lhs.type, rhs.type], valueMap);
  return fn ? fn(context, lhs, rhs) : null;
};

export const ADD = createOperation(addValueMap);
export const SUBTRACT = createOperation(subtractValueMap);
export const MULTIPLY = createOperation(multiplyValueMap);
export const MULTIPLY_COND_DIMENSIONS_LENGTH_1 = createOperation(multiplyCondDimensionsLength1);
export const DIVIDE = createOperation(divideValueMap);
export const NEGATE = createOperation(negateValueMap);
export const EXPONENT = createOperation(exponentValueMap);
