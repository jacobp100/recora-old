import { entity, percentage, color, empty } from '../types';
import * as entityMath from './entity';
import * as entityPercentageMath from './entityPercentage';
import * as colorPercentageMath from './colorPercentage';


const negativeEntity = { ...entity, value: -1 };

const addValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.add,
    [percentage.type]: entityPercentageMath.add,
  },
  [color.type]: {
    [percentage.type]: colorPercentageMath.add,
  },
};
const subtractValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.subtract,
    [percentage.type]: entityPercentageMath.subtract,
  },
  [color.type]: {
    [percentage.type]: colorPercentageMath.subtract,
  },
};
const multiplyValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.multiply,
    [percentage.type]: entityPercentageMath.multiply,
  },
};
const multiplyCondDimensionsLengthOnly = {
  [entity.type]: {
    [entity.type]: entityMath.multiplyCondDimensionsLengthOnly,
  },
};
const divideValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.divide,
    [percentage.type]: entityPercentageMath.divide,
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
export const MULTIPLY_COND_DIMENSIONS_LENGTH_ONLY = createOperation(multiplyCondDimensionsLengthOnly);
export const DIVIDE = createOperation(divideValueMap);
export const NEGATE = createOperation(negateValueMap);
export const EXPONENT = createOperation(exponentValueMap);
