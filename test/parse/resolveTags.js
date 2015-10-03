import { findLeftConversion, findRightConversion } from '../../parse/resolveTags';
import assert from 'assert';

describe('parse', function() {
  describe('find left conversion', function() {
    it('should find "yards" for "yards in 1 meter"', function() {
      const context = {
        tags: [
          { type: 'TAG_UNIT', value: 'yard', power: 1 },
          { type: 'NOOP' },
          { type: 'TAG_NUMBER', value: 1 },
          { type: 'TAG_UNIT', value: 'meter', power: 1 },
        ],
      };
      const result = findLeftConversion(context);

      assert.deepEqual(result.conversion, { yard: 1 });
      assert.equal(result.tags.length, 2);
      assert.equal(result.tags[0], context.tags[2]);
      assert.equal(result.tags[1], context.tags[3]);
    });

    it('should not convert "€1"', function() {
      const context = {
        tags: [
          { type: 'TAG_UNIT', value: 'EUR', power: 1 },
          { type: 'TAG_NUMBER', value: 1 },
        ],
      };
      const result = findLeftConversion(context);

      assert.equal(result.conversion, null);
      assert.deepEqual(result.tags, context.tags);
    });
  });

  describe('find right conversion', function() {
    it('should find "yard" for "1 meter to yards"', function() {
      const context = {
        tags: [
          { type: 'TAG_NUMBER', value: 1 },
          { type: 'TAG_UNIT', value: 'meter', power: 1 },
          { type: 'NOOP' },
          { type: 'TAG_UNIT', value: 'yard', power: 1 },
        ],
      };
      const result = findRightConversion(context);

      assert.deepEqual(result.conversion, { yard: 1 });
      assert.equal(result.tags.length, 2);
      assert.equal(result.tags[0], context.tags[0]);
      assert.equal(result.tags[1], context.tags[1]);
    });

    it('should find "foot" and "inch" as a composite conversion for "1 meter to foot and inches"', function() {
      const context = {
        tags: [
          { type: 'TAG_NUMBER', value: 1 },
          { type: 'TAG_UNIT', value: 'meter', power: 1 },
          { type: 'NOOP' },
          { type: 'TAG_UNIT', value: 'foot', power: 1 },
          { type: 'NOOP' },
          { type: 'TAG_UNIT', value: 'inch', power: 1 },
        ],
      };
      const result = findRightConversion(context);

      assert.deepEqual(result.conversion, [{ foot: 1 }, { inch: 1 }]);
      assert.equal(result.tags.length, 2);
      assert.equal(result.tags[0], context.tags[0]);
      assert.equal(result.tags[1], context.tags[1]);
    });

    it('should find "yards" and "minute" as a single unit conversion for "1 meter per second to yards per minute"', function() {
      const context = {
        tags: [
          { type: 'TAG_NUMBER', value: 1 },
          { type: 'TAG_UNIT', value: 'meter', power: 1 },
          { type: 'TAG_UNIT', value: 'second', power: -1 },
          { type: 'NOOP' },
          { type: 'TAG_UNIT', value: 'yard', power: 1 },
          { type: 'TAG_UNIT', value: 'minute', power: -1 },
        ],
      };
      const result = findRightConversion(context);

      assert.deepEqual(result.conversion, { yard: 1, minute: -1 });
      assert.equal(result.tags.length, 3);
      assert.equal(result.tags[0], context.tags[0]);
      assert.equal(result.tags[1], context.tags[1]);
      assert.equal(result.tags[2], context.tags[2]);
    });

    it('should not convert "1 meter 1 inch"', function() {
      const context = {
        tags: [
          { type: 'TAG_NUMBER', value: 1 },
          { type: 'TAG_UNIT', value: 'meter', power: 1 },
          { type: 'NOOP' },
          { type: 'TAG_NUMBER', value: 1 },
          { type: 'TAG_UNIT', value: 'inch', power: 1 },
        ],
      };
      const result = findRightConversion(context);

      assert.equal(result.conversion, null);
      assert.deepEqual(result.tags, context.tags);
    });
  });
});
