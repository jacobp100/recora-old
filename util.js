// import { pipe, equals, mapAccum, mapAccumRight, isNil, last, reject, length } from 'ramda';

export const mapWithAccum = pipe(mapAccum, last);
export const mapWithAccumRight = pipe(mapAccumRight, last);
export const rejectNil = reject(isNil);
export const lengthIsOne = pipe(length, equals(1));
