import mathp from 'mathp';
import { toSi, dimensions } from '../entity';
import { objectEmpty } from '../../util';

const equation = curry((inputFn, context, power, [entity]) => {
  if (objectEmpty(entity.symbols) && objectEmpty(dimensions(context, entity))) {
    const si = toSi(context, entity);
    const value = Math.pow(inputFn(si.value), power);
    return { ...si, value };
  }
  return null;
});

export const sin = equation(x => (x % Math.PI !== 0) ? Math.sin(x) : 0); // Fix annoying sin values
export const cos = equation(Math.cos);
export const tan = equation(Math.tan);
export const ln = equation(Math.log);
export const log = ln;
export const round = equation(Math.round);
export const floor = equation(Math.floor);
export const ceil = equation(Math.ceil);
export const abs = equation(Math.abs);
export const sqrt = equation(Math.sqrt);

export const acosh = equation(mathp.acosh);
export const asinh = equation(mathp.asinh);
export const atanh = equation(mathp.atanh);
export const cbrt = equation(mathp.cbrt);
export const clz32 = equation(mathp.clz32);
export const cosh = equation(mathp.cosh);
export const fround = equation(mathp.fround);
export const log1p = equation(mathp.log1p);
export const log10 = equation(mathp.log10);
export const log2 = equation(mathp.log2);
export const sign = equation(mathp.sign);
export const sinh = equation(mathp.sinh);
export const tanh = equation(mathp.tanh);
export const trunc = equation(mathp.trunc);

export const sinc = equation(mathp.sinc);
export const sec = equation(mathp.sec);
export const csc = equation(mathp.csc);
export const cot = equation(mathp.cot);
export const asec = equation(mathp.asec);
export const acsc = equation(mathp.acsc);
export const acot = equation(mathp.acot);
export const sech = equation(mathp.sech);
export const csch = equation(mathp.csch);
export const coth = equation(mathp.coth);
export const asech = equation(mathp.asech);
export const acsch = equation(mathp.acsch);
export const acoth = equation(mathp.acoth);

export const cosc = equation(x => Math.cos(x) / x);
export const tanc = equation(x => (x === 0) ? 1 : Math.tan(x) / x);
