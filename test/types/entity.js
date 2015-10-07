import { entity, compositeEntity } from '../../src/types';
import { isResolvable, dimensions, baseDimensions, toSi, convert, convertComposite } from '../../src/types/entity';
import * as locale from '../../src/environment';
import assert from 'assert';

describe('entity type', function() {
  const normalContext = {};

  describe('is resolvable', function() {
    it('returns true if an entity contains only linear units', function() {
      const value = { ...entity, value: 1, units: { meter: 1, second: -1 } };
      assert.equal(isResolvable(normalContext, value), true);
    });

    it('returns true if an entity contains a non-linear unit', function() {
      const value = { ...entity, value: 1, units: { Celsius: 1 } };
      assert.equal(isResolvable(normalContext, value), true);
    });

    it('returns false if an entity contains a both linear and non-linear units', function() {
      const value = { ...entity, value: 1, units: { meter: 1, Celsius: 1 } };
      assert.equal(isResolvable(normalContext, value), false);
    });

    it('returns false if an entity contains a non-linear unit of a power that is not one', function() {
      const value1 = { ...entity, value: 1, units: { Celsius: 2 } };
      const value2 = { ...entity, value: 1, units: { Celsius: -1 } };
      assert.equal(isResolvable(normalContext, value1), false);
      assert.equal(isResolvable(normalContext, value2), false);
    });
  });

  describe('resolve dimensionless units', function() {
    it('removes dimensionless units and adjusts the value', function() {
      const value = { ...entity, value: 1, units: { degree: 1 } };
      const siValue = toSi(normalContext, value);

      assert.equal(siValue.value.toFixed(5), '0.01745');
      assert.deepEqual(siValue.units, {});
    });

    it('ignores non-dimensionless units', function() {
      const value = { ...entity, value: 1, units: { meter: 1 } };
      const siValue = toSi(normalContext, value);

      assert.equal(siValue.value, 1);
      assert.deepEqual(siValue.units, { meter: 1 });
    });
  });

  describe('dimensions', function() {
    it('should return the dimensions for an entity', function() {
      const value = { ...entity, units: { meter: 1, second: -2 } };
      const valueDimensions = dimensions(normalContext, value);

      assert.deepEqual(valueDimensions, {
        length: 1,
        time: -2,
      });
    });

    it('should keep derived dimensions in their form', function() {
      const value = { ...entity, units: { liter: 1 } };
      const valueDimensions = dimensions(normalContext, value);

      assert.deepEqual(valueDimensions, { volume: 1 });
    });
  });

  describe('base dimensions', function() {
    it('should return the base dimensions for an entity', function() {
      const value = { ...entity, units: { meter: 1, second: -2 } };
      const valueDimensions = baseDimensions(normalContext, value);

      assert.deepEqual(valueDimensions, {
        length: 1,
        time: -2,
      });
    });

    it('should resolve derived dimensions', function() {
      const value = { ...entity, units: { liter: 1 } };
      const valueDimensions = baseDimensions(normalContext, value);

      assert.deepEqual(valueDimensions, { length: 3 });
    });
  });

  describe('to si', function() {
    it('should convert units to si units', function() {
      assert.equal(locale.getSiUnit(normalContext, 'length'), 'meter');
      assert.equal(locale.getSiUnit(normalContext, 'time'), 'second');

      const value = { ...entity, units: { yard: 1, minute: -2 } };
      const siValue = toSi(normalContext, value);

      assert.deepEqual(siValue.units, {
        meter: 1,
        second: -2,
      });
    });

    it('should keep derived dimensions in their form', function() {
      const value = { ...entity, units: { quart: 1 } };
      const siValue = toSi(normalContext, value);

      assert.deepEqual(siValue.units, { liter: 1 });
    });

    it('removes dimensionless units', function() {
      const value = { ...entity, units: { meter: 1, degree: 1 } };
      const siValue = toSi(normalContext, value);

      assert.deepEqual(siValue.units, { meter: 1 });
    });

    it('should convert to si units defined in the context', function() {
      const newContext = { ...normalContext, si: { length: 'inch' } };

      const value = { ...entity, units: { meter: 1 } };
      const siValue = toSi(newContext, value);

      assert.deepEqual(siValue.units, { inch: 1 });
    });
  });

  describe('convert', function() {
    it('should convert between units', function() {
      const value = { ...entity, value: 1, units: { meter: 1 } };
      const units = { yard: 1 };
      const result = convert(normalContext, units, value);

      assert.equal(result.value.toFixed(2), 1.09);
      assert.deepEqual(result.units, units);
    });

    it('should convert between units of different powers', function() {
      const value = { ...entity, value: 1, units: { meter: 2 } };
      const units = { centimeter: 2 };
      const result = convert(normalContext, units, value);

      assert.equal(result.value, 10000);
      assert.deepEqual(result.units, units);
    });

    it('should convert between non-linear units', function() {
      const value = { ...entity, value: 100, units: { Celsius: 1 } };
      const units = { Fahrenheit: 1 };
      const result = convert(normalContext, units, value);

      assert.equal(result.value.toFixed(0), 212);
      assert.deepEqual(result.units, units);
    });

    it('should convert between derived units', function() {
      const value = { ...entity, value: 1, units: { Joule: 1 } };
      const units = { kilowatt: 1, hour: 1 };
      const result = convert(normalContext, units, value);

      assert.deepEqual(result.units, units);
    });
  });

  describe('convert composite', function() {
    it('should convert to multiple units', function() {
      const value = { ...entity, value: 1, units: { meter: 1 } };
      const units = [{ foot: 1 }, { inch: 1 }];
      const result = convertComposite(normalContext, units, value);
      const [feet, inch] = result.value;

      assert.equal(result.type, compositeEntity.type);
      assert.equal(result.value.length, 2);
      assert.equal(feet.value, 3);
      assert.deepEqual(feet.units, { foot: 1 });
      assert.equal(inch.value, 3);
      assert.deepEqual(inch.units, { inch: 1 });
    });
  });
});
