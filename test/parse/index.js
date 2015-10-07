import { TAG_UNIT, TAG_PARSE_OPTIONS, TAG_NUMBER, TAG_SYMBOL, TAG_NOOP } from '../../src/parse/tags';
import { getTagOptions } from '../../src/parse';
import assert from 'assert';

describe('parse', function() {
  describe('get tag options', function() {
    it('should return all options in order for parse options', function() {
      const option1 = { type: TAG_SYMBOL, value: 'to' };
      const option2 = { type: TAG_NOOP };

      const context = {
        tags: [
          { type: TAG_UNIT, value: 'yard', power: 1 },
          {
            type: TAG_PARSE_OPTIONS,
            value: [option1, option2],
          },
          { type: TAG_NUMBER, value: 1 },
          { type: TAG_UNIT, value: 'meter', power: 1 },
        ],
      };
      const tagOptions = getTagOptions(context);

      assert.equal(tagOptions.length, 2);
      assert.equal(tagOptions[0].tags[1], option1);
      assert.equal(tagOptions[1].tags[1], option2);
    });

    it('should return all options for parse options sorted by least depth', function() {
      const option1 = { type: TAG_UNIT, value: 'meter', power: 1 };
      const option2 = { type: TAG_NOOP };

      const context = {
        tags: [
          {
            type: TAG_PARSE_OPTIONS,
            value: [option1, option2],
          },
          {
            type: TAG_PARSE_OPTIONS,
            value: [option1, option2],
          },
        ],
      };
      const tagOptions = getTagOptions(context);

      const sortTagOptions = sortBy(prop('type'));
      const sortedOption1Option2 = sortTagOptions([option1, option2]);

      assert.equal(tagOptions.length, 4);
      assert.equal(tagOptions[0].tags[0], option1);
      assert.equal(tagOptions[0].tags[1], option1);

      assert.notDeepEqual(tagOptions[1].tags, tagOptions[2].tags);
      assert.deepEqual(sortTagOptions(tagOptions[1].tags), sortedOption1Option2);
      assert.deepEqual(sortTagOptions(tagOptions[2].tags), sortedOption1Option2);

      assert.equal(tagOptions[3].tags[0], option2);
      assert.equal(tagOptions[3].tags[1], option2);
    });

    it('should either include all of a type of symbol or none', function() {
      const option1 = { type: TAG_SYMBOL, value: 'a' };
      const option2 = { type: TAG_SYMBOL, value: 'b' };
      const option3 = { type: TAG_SYMBOL, value: 'c' };
      const noop = { type: TAG_NOOP };

      const context = {
        tags: [
          {
            type: TAG_PARSE_OPTIONS,
            value: [option1, option2, noop],
          },
          {
            type: TAG_PARSE_OPTIONS,
            value: [option1, noop, option2],
          },
          {
            type: TAG_PARSE_OPTIONS,
            value: [option2, option3, noop],
          },
        ],
      };
      const tagOptions = getTagOptions(context);

      assert.equal(tagOptions.length, 5);

      assert.equal(tagOptions[0].tags[0], option2);
      assert.equal(tagOptions[0].tags[1], option2);
      assert.equal(tagOptions[0].tags[2], option2);

      assert.equal(tagOptions[1].tags[0], option1);
      assert.equal(tagOptions[1].tags[1], option1);
      assert.equal(tagOptions[1].tags[2], option3);

      assert.equal(tagOptions[2].tags[0], noop);
      assert.equal(tagOptions[2].tags[1], noop);
      assert.equal(tagOptions[2].tags[2], option3);

      assert.equal(tagOptions[3].tags[0], option1);
      assert.equal(tagOptions[3].tags[1], option1);
      assert.equal(tagOptions[3].tags[2], noop);

      assert.equal(tagOptions[4].tags[0], noop);
      assert.equal(tagOptions[4].tags[1], noop);
      assert.equal(tagOptions[4].tags[2], noop);
    });
  });
});
