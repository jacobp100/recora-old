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
      type: 'INTERMEDIATE_UNRESOLVED_BRACKETS',
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

const resolveTagBrackets = pipe(
  reduce(resolveBracket, {
    groups: [],
    bracketLevel: -1,
    bracketGroup: null, // Array<Array<tag>>
  }),
  prop('groups'),
  map(resolveUnresolvedBrackets)
);

function resolveUnresolvedBrackets(tag) {
  if (tag.type === 'INTERMEDIATE_UNRESOLVED_BRACKETS') {
    const statements = resolveTagBrackets(tag); // And solve?
    let value;

    if (statements.length === 1) {
      value = statements[0];
    } else {
      value = {
        type: 'STATEMENT_MIXED',
        statements,
      };
    }

    return {
      type: 'TAG_BRACKETS',
      value,
    };
  }

  return tag;
}

const createASTFromTags = pipe(
  resolveTagBrackets,
);

export default function resolveTags(tags) {
  const { tags: tagsWithoutConversions, conversion } = { tags }; // get metadata
  const ast = createASTFromTags(tagsWithoutConversions);
  return ast.resolve();
}
