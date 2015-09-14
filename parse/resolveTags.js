import { reduce, get, flow } from 'lodash-fp';

function appendToLastArray(array, element) {
  const newArray = array.slice();
  const lastGroup = [newArray.length - 1];
  newArray[newArray.length - 1] = [...lastGroup, element];
  return newArray;
}

const resolveTagBracket = {
  TAG_OPEN_BRACKET(groups, bracketLevel, bracketGroup, tag) {
    let newBracketGroup;

    if (bracketLevel === 0) {
      newBracketGroup = [[]];
    } else if (bracketLevel > 0) {
      newBracketGroup = appendToLastArray(bracketGroup, tag);
    } else {
      newBracketGroup = bracketGroup;
    }

    return {
      groups,
      bracketLevel: bracketLevel + 1,
      bracketGroup: newBracketGroup,
    };
  },
  TAG_CLOSE_BRACKET(groups, bracketLevel, bracketGroup, tag) {
    if (bracketLevel >= 0) {
      return {
        groups,
        bracketLevel: bracketLevel - 1,
        bracketGroup: appendToLastArray(bracketGroup, tag),
      };
    }

    const newElement = {
      type: 'unsolved-brackets',
      value: bracketGroup,
    };

    return {
      groups: [...groups, newElement],
      bracketLevel: -1,
      bracketGroup: null,
    };
  },
  TAG_COMMA(groups, bracketLevel, bracketGroup, tag) {
    if (bracketLevel === 0) {
      return {
        groups,
        bracketLevel,
        bracketGroup: [...bracketGroup, []],
      };
    } else if (bracketLevel > 0) {
      return {
        groups,
        bracketLevel,
        bracketGroup: appendToLastArray(bracketGroup, tag),
      };
    }

    return {
      groups: [...groups, tag],
      bracketLevel,
      bracketGroup,
    };
  },
  default(groups, bracketLevel, bracketGroup, tag) {
    if (bracketLevel >= 0) {
      return {
        groups,
        bracketLevel,
        bracketGroup: appendToLastArray(bracketGroup, tag),
      };
    }

    return {
      groups: [...groups, tag],
      bracketLevel,
      bracketGroup,
    };
  },
};

function resolveBracket({ groups, bracketLevel, bracketGroup }, tag) {
  const fn = resolveTagBracket[tag.type] || resolveBracket.default;
  return fn(groups, bracketLevel, bracketGroup, tag);
}

const resolveTags = flow(
  reduce(resolveBracket, {
    groups: [],
    bracketLevel: -1,
    bracketGroup: null, // Array<Array<tags>>
  }),
  get('groups')
);
export default resolveTags;
