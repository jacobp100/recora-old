import mathp from 'mathp';
import { toSi, dimensions } from '../types/entity';
import { objectEmpty } from '../util';
import * as colorFunctions from './colorFunctions';

const equation = curry((inputFn, context, power, [entity]) => {
  if (objectEmpty(entity.symbols) && objectEmpty(dimensions(context, entity))) {
    const si = toSi(context, entity);
    const value = Math.pow(inputFn(si.value), power);
    return { ...si, value };
  }
  return null;
});

const baseLog = equation(Math.log);

const functions = {
  ...colorFunctions,

  sin: equation(x => (x % Math.PI !== 0) ? Math.sin(x) : 0), // Fix annoying sin values
  cos: equation(Math.cos),
  tan: equation(Math.tan),
  ln: baseLog,
  log: baseLog,
  round: equation(Math.round),
  floor: equation(Math.floor),
  ceil: equation(Math.ceil),
  abs: equation(Math.abs),
  sqrt: equation(Math.sqrt),

  acosh: equation(mathp.acosh),
  asinh: equation(mathp.asinh),
  atanh: equation(mathp.atanh),
  cbrt: equation(mathp.cbrt),
  clz32: equation(mathp.clz32),
  cosh: equation(mathp.cosh),
  fround: equation(mathp.fround),
  log1p: equation(mathp.log1p),
  log10: equation(mathp.log10),
  log2: equation(mathp.log2),
  sign: equation(mathp.sign),
  sinh: equation(mathp.sinh),
  tanh: equation(mathp.tanh),
  trunc: equation(mathp.trunc),

  sinc: equation(mathp.sinc),
  sec: equation(mathp.sec),
  csc: equation(mathp.csc),
  cot: equation(mathp.cot),
  asec: equation(mathp.asec),
  acsc: equation(mathp.acsc),
  acot: equation(mathp.acot),
  sech: equation(mathp.sech),
  csch: equation(mathp.csch),
  coth: equation(mathp.coth),
  asech: equation(mathp.asech),
  acsch: equation(mathp.acsch),
  acoth: equation(mathp.acoth),

  cosc: equation(x => Math.cos(x) / x),
  tanc: equation(x => (x === 0) ? 1 : Math.tan(x) / x),
};
export default functions;
