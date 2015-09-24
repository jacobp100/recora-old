import units from './data/environment/units';
import si from './data/environment/si';
import abbreviations from './data/en/abbreviations';

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
// export function getUnitName(context, unit) {
//   if (unit === 's') {
//     return 'second';
//   }
//
//   const name = singularize(unit);
//   const abbreviation = abbreviations[name];
//
//   if (abbreviation) {
//     return abbreviation;
//   }
//
//   if (any(whereEq({ name }), units)) {
//     return name;
//   }
//
//   return null;
// }
// export function getUnitByName(context, name) {
//   return find(whereEq({ name }), units);
// }
// export function getUnit(context, name) {
//   // FIXME: Can be pipeWithNull
//   const unitName = getUnitName(context, name);
//
//   if (unitName) {
//     return getUnitByName(unitName);
//   }
//   return null;
// }
export const getConstant = always(null); // FIXME
