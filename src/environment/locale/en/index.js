import { singularize } from './pluralization';
import units from '../../../units';
import abbreviations from '../../../data/en/abbreviations';


export { formatEntity } from './formatEntity';
export { preprocessTags } from './preprocessTags';


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
