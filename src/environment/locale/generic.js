import { ifElse, pipe, equals, always, replace } from 'ramda';

export const powerString = ifElse(pipe(Number, equals(1)),
  always(''),
  pipe(
    // Fuck it
    String,
    replace('0', '⁰'),
    replace('1', '¹'),
    replace('2', '²'),
    replace('3', '³'),
    replace('4', '⁴'),
    replace('5', '⁵'),
    replace('6', '⁶'),
    replace('7', '⁷'),
    replace('8', '⁸'),
    replace('9', '⁹'),
    replace('.', ' '),
    replace('-', '⁻')
  )
);
