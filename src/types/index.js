export const entity = {
  type: 'ENTITY',
  value: null,
  units: {},
  symbols: {},
};

export const percentage = {
  type: 'PERCENTAGE',
  value: null,
};

// FIXME: color shouldn't contain a color-forge instance, only the data required to instantiate it
// so the context is always serializable
export const color = {
  type: 'COLOR',
  value: null,
  colorSpace: null,
};

export const timezone = {
  type: 'TIMEZONE',
  value: {},
};

export const datetime = {
  type: 'DATETIME',
  value: {},
};

export const funcApplication = {
  type: 'FUNC_APPLICATION',
  func: null,
  groups: [],
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
  groups: [],
  operations: [[]],
  level: -1,
};

export const valueAssignment = {
  type: 'VALUE_ASSIGNMENT',
  key: null,
  value: null,
};

export const bracketGroup = {
  type: 'BRACKET_GROUP',
  groups: [],
};

export const miscGroup = {
  type: 'MISC_GROUP',
  groups: [],
};

export const empty = {
  type: 'EMPTY',
  value: null,
};
