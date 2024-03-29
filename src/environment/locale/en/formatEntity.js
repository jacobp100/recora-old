import { pipe, head, equals, prop, propOr, reduce, partial, toPairs, partialRight } from 'ramda';
import { pluralize } from './pluralization';
import { powerString } from '../generic';
import unitFormatting from '../../../data/en/unitFormatting';
import { objectEmpty } from '../../../util';


const isSpecialUnit = pipe(head, equals('_'));
const noSymbols = pipe(prop('symbols'), objectEmpty);

const baseNames = {
  2: '0b',
  8: '0o',
  10: '',
  16: '0x',
};

function formatEntityNumber(context, formattingHints, entity) {
  const { base } = context.hints;

  if (entity.value === 1 && !noSymbols(entity)) {
    return '';
  } else if (base) {
    const prefix = propOr(`(base ${base}) `, base, baseNames);
    return prefix + entity.value.toString(base);
  } else if (formattingHints.currency) {
    return entity.value.toFixed(2);
  }

  const absValue = Math.abs(entity.value);

  if (absValue > 1E2 || absValue === 0) {
    return entity.value.toFixed(0);
  } else if (absValue > 1E-6) {
    // Note bigger than zero, so no log 0
    const orderOfMagnitude = Math.floor(Math.log10(absValue));
    const magnitude = Math.pow(10, orderOfMagnitude);

    if (absValue - Math.floor(absValue) < magnitude * 1E-3) {
      return entity.value.toFixed(0); // Last three numbers zero. i.e. 1,234,000
    }
    return entity.value.toFixed(2 - orderOfMagnitude);
  }
  return entity.value.toExponential(3);
}


function formatEntityReducerFn(entity, out, [unit, value]) {
  if (isSpecialUnit(unit)) {
    return out;
  } else if (value === 1 && unitFormatting[unit]) {
    const specialUnit = unitFormatting[unit];

    if (specialUnit.prefix) {
      return specialUnit.prefix + out;
    } else if (specialUnit.suffix) {
      return out + specialUnit.suffix;
    }
  }
  const unitPlural = (value >= 1 && entity.value !== 1) ? pluralize(unit) : unit;

  return `${out} ${(value < 0) ? 'per ' : ''}${unitPlural}${powerString(Math.abs(value))}`;
}
const formatEntityUnits = (entity, str) =>
  reduce(partial(formatEntityReducerFn, [entity]), str, toPairs(entity.units));


export default function formatEntity(context, entity, formattingHints) {
  return pipe(
    partialRight(formatEntityNumber, [entity]),
    partial(formatEntityUnits, [entity])
  )(context, formattingHints);
}
