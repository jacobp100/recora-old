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

export const color = {
  type: 'COLOR',
  value: null,
  colorSpace: null,
};

export const datetime = {
  type: 'DATETIME',
};

export const timezone = {
  type: 'TIMEZONE',
};

export const timezoneOffset = {
  type: 'TIMEZONE_OFFSET',
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
