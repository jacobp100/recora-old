import units from './data/environment/units';
import abbreviations from './data/en/abbreviations';
import { merge, always, identity, invert, last, init } from 'ramda';

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
export const getConstant = always(null); // FIXME
