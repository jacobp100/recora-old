export const entity = {
  type: 'ENTITY',
  value: null,
  units: {},
  symbols: {},
};

export const compositeEntity = {
  type: 'COMPOSITE_ENTITY',
  entity: null,
  value: null,
};

export const operationsGroup = {
  type: 'OPERATIONS_GROUP',
  groups: [],
  operations: [],
  level: -1,
};

export const miscGroupBase = {
  type: 'MISC_GROUP',
  groups: null,
};

export const empty = {
  type: 'EMPTY',
  value: null,
};
