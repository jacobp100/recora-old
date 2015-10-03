import units from './data/environment/units';
import si from './data/environment/si';
import abbreviations from './data/en/abbreviations';
import unitFormatting from './data/en/unitFormatting';

// TODO: JSON
const pluralMap = {
  'century': 'centuries',
  'inch': 'inches',
  'foot': 'feet',
  'us': 'us',
  'kelvin': 'kelvin',
  'celsius': 'celsius',
  'fahrenheit': 'fahrenheit',
  'gas': 'gas',
};
const singularMap = invert(pluralMap);

function singularize(word) {
  const plural = word.toLowerCase().trim();

  if (singularMap[plural]) {
    return singularMap[plural];
  } else if (last(plural) === 's') {
    return init(plural);
  }
  return plural;
}

function pluralize(word) {
  const singular = word.trim();
  return pluralMap[singular] || (singular + 's');
}

/*
These functions are all in the locale 'en'. If we add more locales, we'll have to refactor this.
*/

export const getNumberFormat = always('\\d+(?:\\.\\d+)?');
export const parseNumber = (context, value) => Number(value.replace(',', ''));
export const getFormattingHints = merge({ hints: [] });
export const preprocessTags = identity;
export function getSiUnit(context, name) {
  return si[name] || name;
}
export function getUnitValue(context, name) {
  // FIXME: Check context
  return units[name];
}
export function getUnitName(context, unit) {
  if (unit === 's') {
    return 'second';
  }

  const singularUnit = singularize(unit);
  const abbreviation = abbreviations[singularUnit];

  if (abbreviation) {
    return abbreviation;
  } else if (units[singularUnit]) {
    return singularUnit;
  }
  return null;
}
export const getConstant = always(null); // FIXME

// FIXME: This is all shitty. types/entity should call back into locale to do special formatting, such as currency, and also regular formatting, such as adding a unit
const isSpecialUnit = pipe(
  head,
  equals('_'),
);
const noSymbols = pipe(prop('symbols'), keys, isEmpty);
function formatEntityNumber(entity, formattingHints) {
  if (entity.value === 1 && !noSymbols(entity)) {
    return '';
  } else if (formattingHints.base) {
    return entity.value.toString(entity.formattingHints.base);
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
      return entity.value.toFixed(0);
    }
    return entity.value.toFixed(2 - orderOfMagnitude);
  }
  return entity.value.toExponential(3);
}

const powerString = ifElse(pipe(Number, equals(1)),
  always(''),
  pipe(
    // Fuck it
    String,
    replace('0', '⁰'),
    replace('1', '¹'),
    replace('2', '²'),
    replace('3', '³'),
    replace('4', '⁴'),
    replace('5', '⁵'),
    replace('6', '⁶'),
    replace('7', '⁷'),
    replace('8', '⁸'),
    replace('9', '⁹'),
    replace('.', ' '),
    replace('-', '⁻'),
  ),
);
function formatEntityUnits(entity, str) {
  return reduce((out, [unit, value]) => {
    if (isSpecialUnit(unit)) {
      return out;
    } else if (value === 1 && unitFormatting.hasOwnProperty(unit)) {
      const specialUnit = unitFormatting[unit];

      if (specialUnit.prefix) {
        return specialUnit.prefix + out;
      } else if (specialUnit.suffix) {
        return out + specialUnit.suffix;
      }
    } else {
      let unitPlural = unit;

      if (value >= 1 && entity.value !== 1) {
        unitPlural = pluralize(unit);
      }

      return `${out} ${(value < 0) ? 'per ' : ''}${unitPlural}${powerString(Math.abs(value))}`;
    }
  }, str, toPairs(entity.units));
}
export function formatEntity(context, entity, formattingHints) {
  return pipe(
    formatEntityNumber,
    partial(formatEntityUnits, entity),
  )(entity, formattingHints);
}
