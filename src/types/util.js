import { entity, percentage, color, datetime, timezone, timezoneOffset, funcApplication, func, compositeEntity, operationsGroup, bracketGroup, miscGroup, empty } from '.';

export const isEntity = whereEq({ type: entity.type });
export const isPercentage = whereEq({ type: percentage.type });
export const isColor = whereEq({ type: color.type });
export const isDatetime = whereEq({ type: datetime.type });
export const isTimezone = whereEq({ type: timezone.type });
export const isTimezoneOffset = whereEq({ type: timezoneOffset.type });
export const isFuncApplication = whereEq({ type: funcApplication.type });
export const isFunc = whereEq({ type: func.type });
export const isCompositeEntity = whereEq({ type: compositeEntity.type });
export const isOperationsGroup = whereEq({ type: operationsGroup.type });
export const isBracketGroup = whereEq({ type: bracketGroup.type });
export const isMiscGroup = whereEq({ type: miscGroup.type });
export const isEmpty = whereEq({ type: empty.type });
