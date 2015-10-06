import { TAG_OPEN_BRACKET, TAG_CLOSE_BRACKET } from './tags';
import { statementParts } from './text';
import * as processTagElement from './processTagElement';
import * as locale from '../locale';
import { mapWithAccum } from '../util';


const findValueAndType = pipe(
  zip(statementParts),
  filter(([type, tag]) => (type !== null && tag !== undefined)),
  head,
);

const processTag = curry((context, captureGroup) => {
  if (captureGroup.type) {
    return captureGroup;
  }

  const [type, value] = findValueAndType(captureGroup);
  const { start, end } = captureGroup;

  const newTag = { start, end, value, type };

  return (processTagElement[type] || processTagElement.DEFAULT)(context, newTag, captureGroup);
});

function resolveTagBracket(bracketLevel, tag) {
  if (tag.type === TAG_OPEN_BRACKET) {
    return [bracketLevel + 1, { ...tag, value: bracketLevel }];
  } else if (tag.type === TAG_CLOSE_BRACKET) {
    return [bracketLevel - 1, { ...tag, value: bracketLevel - 1 }];
  }
  return [bracketLevel, tag];
}

const preprocessTags = pipe(
  locale.preprocessTags,
  over(
    lensProp('tags'),
    reject(isNil),
  ),
  over(
    lens(identity, assoc('tags')),
    context => map(processTag(context), context.tags),
  ),
  over(
    lensProp('tags'),
    mapWithAccum(resolveTagBracket, 0),
  ),
);
export default preprocessTags;
