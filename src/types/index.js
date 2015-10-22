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

export const timezone = {
  type: 'TIMEZONE',
  timezone: 'UTC',
  utcOffset: 0, // Only appliciable when timezone = 'UTC'
};

export const datetime = {
  type: 'DATETIME',
  ...timezone,
  // TODO: parseDates will need to know what to default
  // date: 1,
  // month: 0,
  // year: 0,
  // hour: 0,
  // minute: 0,
  // second: 0,
  // millisecond: 0,
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
