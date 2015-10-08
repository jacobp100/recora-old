import functions from '../baseContext/functions';

export function apply(context, func, entities) {
  const fn = functions[func.name];
  return fn(context, func.power, entities);
}
