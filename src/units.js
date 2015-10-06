import units from './data/units';

const gasMarkToK = [380.4, 394.3, 408.2, 422.0, 435.9, 453.2, 463.7, 477.6, 491.5, 505.4, 519.3];
const kToGasMark = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const unitFunctions = {
  celsiusForwardFn: a => a - 273.15,
  celsiusBackwardFn: a => a + 273.15,
  fahrenheitForwardFn: a => (a - 273.15) * 1.8 + 32,
  fahrenheitBackwardFn: a => (a - 32) / 1.8 + 273.15,
  gasmarkForwardFn: a => (kToGasMark[findIndex(k => k >= a, gasMarkToK)] || last(kToGasMark)),
  gasmarkBackwardFn: a => (gasMarkToK[findIndex(gasMark => gasMark >= a, kToGasMark)] || last(gasMarkToK)),
};

const getUnitFn = prop(__, unitFunctions);
const resolveUnitFns = ifElse(has('forwardFn'),
  evolve({
    forwardFn: getUnitFn,
    backwardFn: getUnitFn,
  }),
  identity,
);

const mappedUnits = mapObj(resolveUnitFns, units);
export default mappedUnits;
