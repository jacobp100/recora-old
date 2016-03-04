import { has } from 'ramda';
import { singularize } from './pluralization';
import units from '../../../baseContext/units';
import abbreviations from '../../../data/en/abbreviations';


export { default as formatEntity } from './formatEntity';
export { default as getFormattingHints } from './getFormattingHints';
export { default as preprocessTags } from './preprocessTags';
export { dateFormats, timeFormats, timezoneFormats } from './parseDates';


export const unitNameIsAbbreviation = (context, unit) => has(unit, abbreviations);

export function getUnitName(context, unit) {
  let abbreviation = abbreviations[unit];

  if (abbreviation) {
    return abbreviation;
  }

  const singularUnit = singularize(unit);
  abbreviation = abbreviations[singularUnit];

  if (abbreviation) {
    return abbreviation;
  } else if (units[singularUnit]) {
    return singularUnit;
  }
  return null;
}
