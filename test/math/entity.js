import { entity } from '../../src/types';
import { add, subtract, multiply, multiplyCondDimensionsLength1, divide, exponent } from '../../src/math/entity';
import * as locale from '../../src/environment';
import assert from 'assert';

describe('entity math', function() {
  const normalContext = {};

  describe('add', function() {
    it('should return null if one side is null', function() {
      const lhs = { ...entity, value: null };
      const rhs = { ...entity, value: 1 };
      const result1 = add(normalContext, lhs, rhs);
      const result2 = add(normalContext, rhs, lhs);

      assert.equal(result1, null);
      assert.equal(result2, null);
    });

    it('should add two entities without units or symbols', function() {
      const lhs = { ...entity, value: 1 };
      const rhs = { ...entity, value: 2 };
      const result = add(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 3);
      assert.deepEqual(result.units, {});
      assert.deepEqual(result.symbols, {});
    });

    it('should add two entities of equal units without conversion', function() {
      assert.notEqual(locale.getSiUnit(normalContext, 'length'), 'inch');

      const lhs = { ...entity, value: 1, units: { inch: 1 } };
      const rhs = { ...entity, value: 2, units: { inch: 1 } };
      const result = add(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 3);
      assert.deepEqual(result.units, { inch: 1 });
      assert.deepEqual(result.symbols, {});
    });

    it('should convert to si units when adding two entities of differing units', function() {
      assert.equal(locale.getSiUnit(normalContext, 'length'), 'meter');

      const lhs = { ...entity, value: 1, units: { inch: 1 } };
      const rhs = { ...entity, value: 2, units: { yard: 1 } };
      const result = add(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.deepEqual(result.units, { meter: 1 });
      assert.deepEqual(result.symbols, {});
    });

    it('should convert to si units defined in the context when adding two entities of differing units', function() {
      const newContext = { ...normalContext, si: { length: 'inch' } };

      const lhs = { ...entity, value: 1, units: { inch: 1 } };
      const rhs = { ...entity, value: 2, units: { yard: 1 } };
      const result = add(newContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.deepEqual(result.units, { inch: 1 });
      assert.deepEqual(result.symbols, {});
    });

    it('should return null when adding two entities of incompatible units', function() {
      const lhs = { ...entity, value: 1, units: { inch: 1 } };
      const rhs = { ...entity, value: 2, units: { second: 1 } };
      const result = add(normalContext, lhs, rhs);

      assert.equal(result, null);
    });

    it('should return null when adding two entities of differing symbols', function() {
      const lhs = { ...entity, value: 1, symbols: { a: 1 } };
      const rhs = { ...entity, value: 2, symbols: { b: 1 } };
      const result = add(normalContext, lhs, rhs);

      assert.equal(result, null);
    });

    it('should add values with different units if one side has a zero value', function() {
      const lhs = { ...entity, value: 1, units: { inch: 1 } };
      const rhs = { ...entity, value: 0, units: { second: 1 } };
      const result = add(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 1);
      assert.deepEqual(result.units, { inch: 1 });
    });

    it('should add values with different symbols if one side has a zero value', function() {
      const lhs = { ...entity, value: 1, symbols: { a: 1 } };
      const rhs = { ...entity, value: 0, symbols: { b: 1 } };
      const result = add(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 1);
      assert.deepEqual(result.symbols, { a: 1 });
    });
  });

  describe('subtract', function() {
    it('should subtract two entities without units or symbols', function() {
      const lhs = { ...entity, value: 1 };
      const rhs = { ...entity, value: 2 };
      const result = subtract(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, -1);
      assert.deepEqual(result.units, {});
      assert.deepEqual(result.symbols, {});
    });

    it('should subtract values with different units if one side has a zero value', function() {
      const lhs = { ...entity, value: 0, units: { inch: 1 } };
      const rhs = { ...entity, value: 1, units: { second: 1 } };
      const result = subtract(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, -1);
      assert.deepEqual(result.units, { second: 1 });
    });

    it('should subtract values with different symbols if one side has a zero value', function() {
      const lhs = { ...entity, value: 0, symbols: { a: 1 } };
      const rhs = { ...entity, value: 1, symbols: { b: 1 } };
      const result = subtract(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, -1);
      assert.deepEqual(result.symbols, { b: 1 });
    });
  });

  describe('multiply', function() {
    it('should return null if one side is null', function() {
      const lhs = { ...entity, value: null };
      const rhs = { ...entity, value: 1 };
      const result1 = multiply(normalContext, lhs, rhs);
      const result2 = multiply(normalContext, rhs, lhs);

      assert.equal(result1, null);
      assert.equal(result2, null);
    });

    it('should return zero without units or symbols if one side is zero', function() {
      const lhs = { ...entity, value: 1, units: { meter: 1 } };
      const rhs = { ...entity, value: 0, units: { inch: 1 } };
      const result = multiply(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 0);
      assert.deepEqual(result.units, {});
      assert.deepEqual(result.symbols, {});
    });

    it('should multiply without conversion', function() {
      assert.notEqual(locale.getSiUnit(normalContext, 'length'), 'inch');

      const lhs = { ...entity, value: 1, units: { inch: 1 } };
      const rhs = { ...entity, value: 3, units: { inch: 1 } };
      const result = multiply(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 3);
      assert.deepEqual(result.units, { inch: 2 });
      assert.deepEqual(result.symbols, {});
    });

    it('should multiply with conversion if the sets of units in each half form no subset or superset', function() {
      // I.e. You can form neither a subset or superset with { a, b, c } and { c, d, e }
      // But { a, b } and { a } can form a subset/superset relation
      const lhs = { ...entity, value: 1, units: { yard: 1 } };
      const rhs = { ...entity, value: 1, units: { inch: 1 } };
      const result = multiply(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.deepEqual(result.units, { meter: 2 });
      assert.deepEqual(result.symbols, {});
    });

    it('should multiply symbols', function() {
      const lhs = { ...entity, value: 1, symbols: { a: 1 } };
      const rhs = { ...entity, value: 3, symbols: { b: -1 } };
      const result = multiply(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 3);
      assert.deepEqual(result.units, {});
      assert.deepEqual(result.symbols, { a: 1, b: -1 });
    });

    it('should remove units without type after multiplication', function() {
      const lhs = { ...entity, value: 1, units: { degree: 1 } };
      const rhs = { ...entity, value: 1, units: { degree: 1 } };
      const result = multiply(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value.toFixed(5), '0.00030');
      assert.deepEqual(result.units, {});
    });
  });

  describe('multiply cond dimensions length 1', function() {
    it('should multiply if both dimensions are of type length', function() {
      assert.notEqual(locale.getSiUnit(normalContext, 'length'), 'inch');

      const lhs = { ...entity, value: 1, units: { inch: 1 } };
      const rhs = { ...entity, value: 3, units: { inch: 1 } };
      const expectedResult = multiply(normalContext, lhs, rhs);
      const result = multiplyCondDimensionsLength1(normalContext, lhs, rhs);

      assert.deepEqual(result, expectedResult);
    });

    it('should multiply if units are different but both dimensions are of type length', function() {
      assert.notEqual(locale.getSiUnit(normalContext, 'length'), 'inch');

      const lhs = { ...entity, value: 1, units: { inch: 1 } };
      const rhs = { ...entity, value: 3, units: { meter: 1 } };
      const result = multiplyCondDimensionsLength1(normalContext, lhs, rhs);
      const expectedResult = multiply(normalContext, lhs, rhs);

      assert.deepEqual(result, expectedResult);
    });

    it('should not multiply one side is not of dimensions length', function() {
      assert.notEqual(locale.getSiUnit(normalContext, 'length'), 'inch');

      const length = { ...entity, value: 1, units: { meter: 1 } };
      const notLength = { ...entity, value: 3, units: { second: 1 } };

      const result1 = multiplyCondDimensionsLength1(normalContext, length, notLength);
      const result2 = multiplyCondDimensionsLength1(normalContext, notLength, length);
      const result3 = multiplyCondDimensionsLength1(normalContext, notLength, notLength);

      assert.equal(result1, null);
      assert.equal(result2, null);
      assert.equal(result3, null);
    });
  });

  describe('divide', function() {
    it('should divide without conversion', function() {
      assert.notEqual(locale.getSiUnit(normalContext, 'length'), 'inch');

      const lhs = { ...entity, value: 4, units: { inch: 1 } };
      const rhs = { ...entity, value: 2, units: { inch: -1 } };
      const result = divide(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 2);
      assert.deepEqual(result.units, { inch: 2 });
      assert.deepEqual(result.symbols, {});
    });

    it('should not return zero on division by zero', function() {
      const lhs = { ...entity, value: 1, units: { inch: 1 } };
      const rhs = { ...entity, value: 0, units: { second: 1 } };
      const result = divide(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, Infinity);
      assert.deepEqual(result.units, { meter: 1, second: -1 });
      assert.deepEqual(result.symbols, {});
    });

    it('should divide symbols', function() {
      const lhs = { ...entity, value: 9, symbols: { a: 1 } };
      const rhs = { ...entity, value: 3, symbols: { b: -1 } };
      const result = divide(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 3);
      assert.deepEqual(result.units, {});
      assert.deepEqual(result.symbols, { a: 1, b: 1 });
    });
  });

  describe('exponent', function() {
    it('should return null if one side is null', function() {
      const lhs = { ...entity, value: null };
      const rhs = { ...entity, value: 1 };
      const result1 = exponent(normalContext, lhs, rhs);
      const result2 = exponent(normalContext, rhs, lhs);

      assert.equal(result1, null);
      assert.equal(result2, null);
    });

    it('should not raise to a power if the right hand side has units', function() {
      const lhs = { ...entity, value: 2 };
      const rhs = { ...entity, value: 3, units: { meter: 1 } };
      const result = exponent(normalContext, lhs, rhs);

      assert.equal(result, null);
    });

    it('should not raise to a power if the right hand side has symbols', function() {
      const lhs = { ...entity, value: 2 };
      const rhs = { ...entity, value: 3, symbols: { a: 1 } };
      const result = exponent(normalContext, lhs, rhs);

      assert.equal(result, null);
    });

    it('should perform an exponent', function() {
      const lhs = { ...entity, value: 2, units: { meter: 1 }, symbols: { a: -2 } };
      const rhs = { ...entity, value: 3 };
      const result = exponent(normalContext, lhs, rhs);

      assert.equal(result.type, entity.type);
      assert.equal(result.value, 8);
      assert.deepEqual(result.units, { meter: 3 });
      assert.deepEqual(result.symbols, { a: -6 });
    });
  });
});
