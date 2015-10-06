/* eslint no-use-before-define: [1, "nofunc"] */
import * as math from './math';
import combineValues from './combineValues';
import { orderDirection } from './operatorTypes';

const containsNil = any(isNil);
const finalNil = pipe(always(reduced(null)));

const resolveBreakNil = fn => pipe(
  fn,
  ifElse(isNil,
    finalNil,
    identity
  )
);

const groupsResolver = (reducer) => (context, locals, group) => (
  pipe(
    prop('groups'),
    map(partial(resolveWithLocals, context, locals)),
    ifElse(containsNil,
      always(null),
      partial(reducer, context, group),
    ),
  )(group)
);


const resolveOperationsGroupBackwardsFn = resolveBreakNil((context, b, [operation, a]) => math[operation](context, a, b));
const resolveOperationsGroupForwardsFn = resolveBreakNil((context, a, [operation, b]) => math[operation](context, a, b));
const groupIsBackwards = pipe(
  prop('level'),
  propEq(__, 'backwards', orderDirection),
);
const resolveOperationsGroup = (context, locals, group) => {
  const { groups: unresolvedGroups, operations } = group;
  const groups = map(partial(resolveWithLocals, context, locals), unresolvedGroups); // FIXME: This is shitty
  const isBackwards = groupIsBackwards(group);

  if (containsNil(groups)) {
    return null;
  }

  const fixedOperations = isBackwards ? reverse(operations) : operations;
  const fixedGroups = isBackwards ? reverse(groups) : groups;
  const resolveFn = isBackwards ? resolveOperationsGroupBackwardsFn : resolveOperationsGroupForwardsFn;

  return reduce(
    partial(resolveFn, context),
    head(fixedGroups),
    zip(fixedOperations, tail(fixedGroups)),
  );
};

const resolveMiscGroupReduceFn = resolveBreakNil(combineValues);
const resolveMiscGroupReducer = (context, locals, group) => reduce(
  partial(resolveMiscGroupReduceFn, context),
  head(group),
  tail(group),
);
const resolveMiscGroup = groupsResolver(resolveMiscGroupReducer);

const resolveBracketGroupHasOneGroup = pipe(nthArg(2), prop('groups'), length, equals(1));
const resolveBracketGroup = ifElse(resolveBracketGroupHasOneGroup,
  resolveMiscGroup,
  always(null),
);

const resolveEntity = (context, locals, entity) => {
  if (entity.value === null) {
    return null;
  }

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

export function resolveWithLocals(context, locals, value) {
  if (!value) {
    return null;
  }

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
    return value;
  }
}

const resolve = over(
  lens(identity, assoc('result')),
  converge(resolveWithLocals, identity, always({}), prop('ast')),
);
export default resolve;
