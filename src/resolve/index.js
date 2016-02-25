/* eslint no-use-before-define: [1, "nofunc"] */
import {
  always, reduced, pipe, when, isNil, prop, map, partial, ifElse, __, propEq, reverse, reduce,
  head, zip, tail, nthArg, equals, mapObj, propOr, values, isEmpty, sum, multiply, evolve, omit,
  keys, over, lens, identity, assoc, converge, length,
} from 'ramda';
import combineValues from './combineValues';
import { operationsGroup, miscGroup, bracketGroup, entity, funcApplication } from '../types';
import { apply } from '../types/funcApplication'; // should this just be in math?
import * as math from '../math';
import { orderDirection } from '../math/operators';
import { containsNil, nilValue } from '../util';

const finalNil = always(reduced(null));

const resolveBreakNil = fn => pipe(
  fn,
  when(isNil, finalNil)
);

const groupsResolver = (reducer) => (context, locals, group) => (
  pipe(
    prop('groups'),
    map(partial(resolveWithLocals, [context, locals])),
    ifElse(containsNil,
      nilValue,
      partial(reducer, [context, group])
    )
  )(group)
);


const resolveOperationsGroupBackwardsFn =
  resolveBreakNil((context, b, [operation, a]) => math[operation](context, a, b));
const resolveOperationsGroupForwardsFn =
  resolveBreakNil((context, a, [operation, b]) => math[operation](context, a, b));
const groupIsBackwards = pipe(
  prop('level'),
  propEq(__, 'backwards', orderDirection)
);
const resolveOperationsGroup = (context, locals, group) => {
  const { groups: unresolvedGroups, operations } = group;
  // FIXME: This is shitty
  const groups = map(partial(resolveWithLocals, [context, locals]), unresolvedGroups);
  const isBackwards = groupIsBackwards(group);

  if (containsNil(groups)) {
    return null;
  }

  const fixedOperations = isBackwards ? reverse(operations) : operations;
  const fixedGroups = isBackwards ? reverse(groups) : groups;
  const resolveFn = isBackwards ?
    resolveOperationsGroupBackwardsFn : resolveOperationsGroupForwardsFn;

  return reduce(
    partial(resolveFn, [context]),
    head(fixedGroups),
    zip(fixedOperations, tail(fixedGroups))
  );
};


const resolveMiscGroupReduceFn = resolveBreakNil(combineValues);
const resolveMiscGroupReducer = (context, locals, group) => reduce(
  partial(resolveMiscGroupReduceFn, [context]),
  head(group),
  tail(group)
);
const resolveMiscGroup = groupsResolver(resolveMiscGroupReducer);

const resolveBracketGroupHasOneGroup = pipe(nthArg(2), prop('groups'), length, equals(1));
const resolveBracketGroup = ifElse(resolveBracketGroupHasOneGroup,
  resolveMiscGroup,
  nilValue
);


const resolveFuncApplaction = (context, locals, value) => {
  const groups = map(partial(resolveWithLocals, [context, locals]), value.groups);

  if (containsNil(groups)) {
    return null;
  }

  return apply(context, value.func, groups);
};


const resolveEntity = (context, locals, value) => {
  if (value.value === null) {
    return null;
  }

  const symbolsMultilicationFactor = pipe(
    mapObj((symbol, power) => (power * propOr(symbol, 0, value.symbols))),
    values,
    ifElse(isEmpty,
      always(1),
      sum
    )
  )(locals);

  return evolve({
    value: multiply(symbolsMultilicationFactor),
    symbols: omit(keys(locals)),
  })(value);
};


export function resolveWithLocals(context, locals, value) {
  if (!value) {
    return null;
  }

  switch (value.type) {
    case operationsGroup.type:
      return resolveOperationsGroup(context, locals, value);
    case miscGroup.type:
      return resolveMiscGroup(context, locals, value);
    case funcApplication.type:
      return resolveFuncApplaction(context, locals, value);
    case bracketGroup.type:
      return resolveBracketGroup(context, locals, value);
    case entity.type:
      return resolveEntity(context, locals, value);
    default:
      return value;
  }
}

const resolve = over(
  lens(identity, assoc('result')),
  converge(resolveWithLocals, [identity, always({}), prop('ast')])
);
export default resolve;
