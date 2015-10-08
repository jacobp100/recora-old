import { singularize } from './pluralization';
import units from '../../../baseContext/units';
import abbreviations from '../../../data/en/abbreviations';


export { formatEntity } from './formatEntity';
export { preprocessTags } from './preprocessTags';


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
