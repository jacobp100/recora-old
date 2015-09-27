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
  // 'person': 'people',
  // 'child': 'children',
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

export const getNumberFormat = always('\\d+');
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
export function getUnit(context, unit) {
  // FIXME: Call it getUnitName
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
function formatEntityNumber(entity) {
  if (entity.value === 1 && !isEmpty(entity.symbols)) {
    return '';
  } /*else if (entity.formattingHints.base) {
    return entity.value.toString(entity.formattingHints.base);
  }*/

  const absValue = Math.abs(entity.value);

  /*if (dimensions(entity).currency === 1) {
    return entity.value.toFixed(2);
  } else */if (absValue > 1E2 || absValue === 0) {
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
function powerString(value) {
  if (Number(value) !== 1) {
    return reduce((out, superscript, value) => (
      out.replace(new RegExp(value, 'g'), superscript)
    ), String(value), powerString.superscripts).replace('.', ' ').replace('-', '⁻');
  }
  return '';
}
powerString.superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
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
export function entityToString(entity) {
  return pipe(
    formatEntityNumber,
    partial(formatEntityUnits, entity),
  )(entity);
}
