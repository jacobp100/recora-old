import entity, { dimensions, baseDimensions, toSi } from '../../types/entity';
import * as locale from '../../locale';
import assert from 'assert';

describe('entity type', function() {
  const normalContext = {}; // Not implemented yet

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

      assert.deepEqual(valueDimensions, {
        volume: 1,
      });
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

      assert.deepEqual(valueDimensions, {
        length: 3,
      });
    });
  });

  describe('to si', function() {
    it('should convert units to si units', function() {
      assert.equal(locale.getSiUnit(normalContext, 'length'), 'meter');
      assert.equal(locale.getSiUnit(normalContext, 'time'), 'second');

      const value = { ...entity, units: { yard: 1, minute: -2 } };
      const valueDimensions = toSi(normalContext, value);

      assert.deepEqual(valueDimensions.units, {
        meter: 1,
        second: -2,
      });
    });

    it('should keep derived dimensions in their form', function() {
      const value = { ...entity, units: { quart: 1 } };
      const valueDimensions = toSi(normalContext, value);

      assert.deepEqual(valueDimensions.units, {
        liter: 1,
      });
    });
  });
});
