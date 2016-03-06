import { toString as typeToString } from './types';

export function toString(context, valueAssignment) {
  return `${valueAssignment.key} = ${typeToString(context, valueAssignment.value)}`;
}
