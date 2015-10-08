import { entity } from '../types';

const constants = {
  pi: { ...entity, value: 3.141592653589793 },
  e: { ...entity, value: 2.718281828459045 },
  phi: { ...entity, value: 1.6180339887498948482 },
  tau: { ...entity, value: 6.283185307179586 },
};
export default constants;
