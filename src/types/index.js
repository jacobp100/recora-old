export const entity = {
  type: 'ENTITY',
  value: null,
  units: {},
  symbols: {},
};

export const funcApplication = {
  type: 'FUNC_APPLICATION',
  func: null,
  groups: null,
};

export const func = {
  type: 'FUNC',
  name: null,
  power: 1,
};

export const compositeEntity = {
  type: 'COMPOSITE_ENTITY',
  entity: null,
  value: null,
};

export const operationsGroup = {
  type: 'OPERATIONS_GROUP',
  groups: null,
  operations: null,
  level: -1,
};

export const bracketGroup = {
  type: 'BRACKET_GROUP',
  groups: null,
};

export const miscGroup = {
  type: 'MISC_GROUP',
  groups: null,
};

export const empty = {
  type: 'EMPTY',
  value: null,
};
