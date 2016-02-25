import {
  pipe, equals, anyPass, ifElse, lt, __, add, allPass, gte, lte, slice, of, length,
} from 'ramda';
import { notNaN } from '../../util';
import { text, textNumber } from '../tags/util';

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

export const shortYear = pipe(
  textNumber,
  ifElse(lt(__, 50),
    add(2000),
    add(1900)
  )
);


export const ms = pipe(textNumber, allPass([
  notNaN,
  gte(__, 0),
  lte(__, 999),
]));

export const s = pipe(textNumber, allPass([
  notNaN,
  gte(__, 0),
  lte(__, 59),
]));

export const mm = allPass([
  textLength2,
  pipe(textNumber, allPass([
    notNaN,
    gte(__, 0),
    lte(__, 59),
  ])),
]);

export const h = pipe(textNumber, allPass([
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

export const D = pipe(textNumber, allPass([
  notNaN,
  gte(__, 1),
  lte(__, 31),
]));

export const DD = allPass([textLength2, D]);

export const M = pipe(textNumber, allPass([
  notNaN,
  gte(__, 1),
  lte(__, 12),
]));

export const MM = allPass([
  textLength2,
  M,
]);

export const YY = allPass([
  pipe(text, length, equals(2)),
  pipe(textNumber, allPass([
    notNaN,
    gte(__, 50),
    lte(__, 0),
  ])),
]);

export const YYYY = pipe(textNumber, allPass([
  notNaN,
  gte(__, 1900),
  lte(__, 2100),
]));
