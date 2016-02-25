import {
  pipe, zip, filter, head, over, lensProp, reject, isNil, lens, identity, assoc, map, partial,
} from 'ramda';
import processTagElement from './processTagElement';
import { TAG_OPEN_BRACKET, TAG_CLOSE_BRACKET } from '../tags';
import { statementParts } from '../text';
import { preprocessTags as environmentPreprocessTags } from '../../environment';
import { mapWithAccum, noneNil } from '../../util';


const findValueAndType = pipe(
  zip(statementParts),
  filter(noneNil),
  head
);

function processTag(context, captureGroup) {
  if (captureGroup.type) {
    return captureGroup;
  }

  const [type, value] = findValueAndType(captureGroup);
  const { start, end } = captureGroup;

  const newTag = { start, end, value, type };

  return (processTagElement[type] || processTagElement.default)(context, newTag, captureGroup);
}

function resolveTagBracket(bracketLevel, tag) {
  if (tag.type === TAG_OPEN_BRACKET) {
    return [bracketLevel + 1, { ...tag, value: bracketLevel }];
  } else if (tag.type === TAG_CLOSE_BRACKET) {
    return [bracketLevel - 1, { ...tag, value: bracketLevel - 1 }];
  }
  return [bracketLevel, tag];
}

const preprocessTags = pipe(
  environmentPreprocessTags,
  over(
    lensProp('tags'),
    reject(isNil)
  ),
  over(
    lens(identity, assoc('tags')),
    context => map(partial(processTag, [context]), context.tags)
  ),
  over(
    lensProp('tags'),
    mapWithAccum(resolveTagBracket, 0)
  )
);
export default preprocessTags;
