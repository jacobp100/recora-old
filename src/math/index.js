import { pipe, ifElse, nthArg, evolve, add, path } from 'ramda';
import { entity, percentage, color, datetime, empty } from '../types';
import { isNumber } from '../types/entity';
import * as entityMath from './entity';
import * as entityPercentageMath from './entityPercentage';
import * as colorMath from './color';
import * as colorPercentageMath from './colorPercentage';
import * as colorEntityMath from './colorEntity';
import * as datetimeEntityMath from './datetimeEntity';
import gamma from 'gamma';
import { nilValue } from '../util';


const negativeEntity = { ...entity, value: -1 };
const entityNegate = (context, emptyValue, entityValue) =>
  entityMath.multiply(context, negativeEntity, entityValue);
const entityFactorial = ifElse(isNumber,
  pipe(nthArg(1), evolve({ value: pipe(add(1), gamma) })),
  nilValue
);


const addValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.add,
    [percentage.type]: entityPercentageMath.add,
    [datetime.type]: datetimeEntityMath.addFlip,
  },
  [color.type]: {
    [color.type]: colorMath.add,
    [percentage.type]: colorPercentageMath.add,
  },
  [datetime.type]: {
    [entity.type]: datetimeEntityMath.add,
  },
};
const subtractValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.subtract,
    [percentage.type]: entityPercentageMath.subtract,
    [datetime.type]: datetimeEntityMath.subtractFlip,
  },
  [color.type]: {
    [color.type]: colorMath.subtract,
    [percentage.type]: colorPercentageMath.subtract,
  },
  [datetime.type]: {
    [entity.type]: datetimeEntityMath.subtract,
  },
};
const multiplyValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.multiply,
    [percentage.type]: entityPercentageMath.multiply,
  },
  [color.type]: {
    [color.type]: colorMath.multiply,
    [entity.type]: colorEntityMath.multiply,
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
  [color.type]: {
    [color.type]: colorMath.divide,
    [entity.type]: colorEntityMath.divide,
  },
};
const negateValueMap = {
  [empty.type]: {
    [entity.type]: entityNegate,
  },
};
const factorialValueMap = {
  [entity.type]: {
    [empty.type]: entityFactorial,
  },
};
const exponentValueMap = {
  [entity.type]: {
    [entity.type]: entityMath.exponent,
  },
  [color.type]: {
    [entity.type]: colorEntityMath.exponent,
  },
};

const createOperation = (valueMap) => (context, lhs, rhs) => {
  const fn = path([lhs.type, rhs.type], valueMap);
  return fn ? fn(context, lhs, rhs) : null;
};

export const ADD = createOperation(addValueMap);
export const SUBTRACT = createOperation(subtractValueMap);
export const MULTIPLY = createOperation(multiplyValueMap);
export const MULTIPLY_COND_DIMENSIONS_LENGTH_ONLY =
  createOperation(multiplyCondDimensionsLengthOnly);
export const DIVIDE = createOperation(divideValueMap);
export const NEGATE = createOperation(negateValueMap);
export const EXPONENT = createOperation(exponentValueMap);
export const FACTORIAL = createOperation(factorialValueMap);
