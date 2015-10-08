export function add(context, entity, percentage) {
  const value = entity.value * (100 + percentage.value) / 100;
  return { ...entity, value };
}

export function subtract(context, entity, percentage) {
  const value = entity.value * (100 - percentage.value) / 100;
  return { ...entity, value };
}

export function multiply(context, entity, percentage) {
  const value = entity.value * percentage.value / 100;
  return { ...entity, value };
}

export function divide(context, entity, percentage) {
  const value = entity.value / percentage.value * 100;
  return { ...entity, value };
}
