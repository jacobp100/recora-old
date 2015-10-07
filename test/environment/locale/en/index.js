import { getUnitName } from '../../../../src/environment/locale/en';
import assert from 'assert';

describe('locale en', function() {
  const normalContext = {};

  describe('get unit name', function() {
    it('should singularize units', function() {
      assert.equal(getUnitName(normalContext, 'meters'), 'meter');
      assert.equal(getUnitName(normalContext, 'inches'), 'inch');
      assert.equal(getUnitName(normalContext, 'feet'), 'foot');
    });

    it('should leave correct units unchanged', function() {
      assert.equal(getUnitName(normalContext, 'meter'), 'meter');
      assert.equal(getUnitName(normalContext, 'inch'), 'inch');
      assert.equal(getUnitName(normalContext, 'foot'), 'foot');
    });

    it('should capitalize units that begin with capitals', function() {
      assert.equal(getUnitName(normalContext, 'kelvin'), 'Kelvin');
      assert.equal(getUnitName(normalContext, 'celsius'), 'Celsius');
      assert.equal(getUnitName(normalContext, 'fahrenheit'), 'Fahrenheit');
    });

    it('should resolve abbreviations', function() {
      assert.equal(getUnitName(normalContext, 'ms'), 'millisecond');
      assert.equal(getUnitName(normalContext, 'm'), 'meter');
      assert.equal(getUnitName(normalContext, 'kg'), 'kilogram');
      assert.equal(getUnitName(normalContext, 'kb'), 'kilobyte');
    });
  });
});
