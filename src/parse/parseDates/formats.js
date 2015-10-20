export const notNaN = complement(isNaN);

export const text = nth(0);
export const textLengthEq = val => pipe(text, length, equals(val));
export const textLength2 = textLengthEq(2);

export const plus = pipe(text, equals('+'));
export const minus = pipe(text, equals('-'));
export const plusMinus = anyPass([plus, minus]);
export const dash = pipe(text, equals('-'));
export const slash = pipe(text, equals('/'));
export const colon = pipe(text, equals(':'));
export const dot = pipe(text, equals('.'));
export const t = pipe(text, equals('t'));


export const ms = pipe(text, Number, allPass([
  notNaN,
  gte(__, 0),
  lte(__, 999),
]));

export const s = pipe(text, Number, allPass([
  notNaN,
  gte(__, 0),
  lte(__, 59),
]));

export const mm = allPass([
  textLength2,
  pipe(text, Number, allPass([
    notNaN,
    gte(__, 0),
    lte(__, 59),
  ])),
]);

export const h = pipe(text, Number, allPass([
  notNaN,
  gte(__, 0),
  lte(__, 23),
]));

export const hh = allPass([textLength2, h]);

export const hhmm = allPass([
  textLengthEq(4),
  pipe(text, slice(0, 2), of, hh),
  pipe(text, slice(2, 4), of, mm),
]);

export const D = pipe(text, Number, allPass([
  notNaN,
  gte(__, 1),
  lte(__, 31),
]));

export const DD = allPass([textLength2, D]);

export const MM = allPass([
  textLength2,
  pipe(text, Number, allPass([
    notNaN,
    gte(__, 1),
    lte(__, 12),
  ])),
]);

export const YY = allPass([
  pipe(text, length, equals(2)),
  pipe(text, Number, allPass([
    notNaN,
    gte(__, 50),
    lte(__, 0),
  ])),
]);

export const YYYY = pipe(text, Number, allPass([
  notNaN,
  gte(__, 1900),
  lte(__, 2100),
]));
