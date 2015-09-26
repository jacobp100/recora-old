/* eslint no-use-before-define: [1, "no-func"] */
import * as math from './math/math';
import combineValues from './combineValues';

const containsNil = any(isNil);
const finalNil = pipe(print('got nill'), always(reduced(null)));

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
    reject(whereEq({ type: 'EMPTY' })),
    map(partial(resolveWithLocals, context, locals)),
    ifElse(containsNil,
      always(null),
      partial(reducer, context, group),
    ),
  )(group)
);


// FIXME: Exponentiation should happen backwards
const resolveOperationsGroupReduceFn = resolveBreakNil((context, a, [operation, b]) => math[operation](context, a, b));
const resolveOperationsGroupReducer = (context, group, groups) =>
  reduce(
    partial(resolveOperationsGroupReduceFn, context),
    head(groups),
    zip(group.operations, tail(groups))
  );
const resolveOperationsGroup = groupsResolver(resolveOperationsGroupReducer);

const resolveMiscGroupReduceFn = resolveBreakNil(combineValues);
const resolveMiscGroupReducer = (context, group, groups) =>
  reduce(
    partial(resolveMiscGroupReduceFn, context),
    head(groups),
    tail(groups)
  );
const resolveMiscGroup = groupsResolver(resolveMiscGroupReducer);

const resolveBracketGroupHasOneGroup = pipe(nthArg(2), prop('groups'), length, equals(1));
const resolveBracketGroup = ifElse(resolveBracketGroupHasOneGroup,
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

export function resolveWithLocals(context, locals, value) {
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

const resolve = over(
  lens(identity, assoc('result')),
  converge(resolveWithLocals, identity, always({}), prop('ast')),
);
export default resolve;
