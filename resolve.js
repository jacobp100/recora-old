/* eslint no-use-before-define: [1, "no-func"] */
import * as math from './math';
import combineValues from './combineValues';

const containsNil = any(isNil);

const resolveBreakNil = fn => pipe(
  fn,
  ifElse(isNil,
    always(reduced(null)),
    identity)
);


const groupsReducer = (fn) => (context, locals, group) => (
  pipe(
    prop('groups'),
    map(partial(resolve, context, locals)),
    ifElse(containsNil,
      always(null),
      reduce(partial(fn, context), head(resolvedGroups), zip(group.operations, tail(resolvedGroups)))
    ),
  )(group)
);


// FIXME: Exponentiation should happen backwards
const resolveOperationsGroupReducer = resolveBreakNil((context, a, [operation, b]) => math[operation](context, a, b));
const resolveOperationsGroup = groupsReducer(resolveOperationsGroupReducer);

const resolveMiscGroupReducer = resolveBreakNil(combineValues);
const resolveMiscGroup = groupsReducer(resolveMiscGroupReducer);

const resolveBracketGroup = ifElse(pipe(arg(2), prop('groups'), length, equals(1)),
  resolveMiscGroup,
  always(null),
);

const resolveEntity = (context, locals, entity) => {
  const symbolsMultilicationFactor = pipe(
    mapObj((key, value) => (value * propOr(key, 0, entity.symbols))),
    values,
    ifElse(isEmpty,
      always(1),
      sum
    ),
  )(locals);

  return evolve({
    value: multiply(symbolsMultilicationFactor),
    symbols: omit(keys(locals)),
  })(entity);
};

export function resolve(context, locals, value) {
  switch (value.type) {
  case 'OPERATIONS_GROUP':
    return resolveOperationsGroup(context, locals, value);
  case 'MISC_GROUP':
    return resolveMiscGroup(context, locals, value);
  case 'BRACKETS_GROUP':
    return resolveBracketGroup(context, locals, value);
  case 'ENTITY':
    return resolveEntity(context, locals, value);
  default:
    return null;
  }
}
