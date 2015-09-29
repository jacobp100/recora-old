import spec from './spec';
import Recora from '../../index';

describe('regression', function() {
  const recora = new Recora();

  spec.forEach(({ description = 'resolve', input, output }) => {
    it(`Should ${description} "${input}"`, function() {
      const result = recora.parse(input);
      const resultOutput = result.resultToString;

      if (resultOutput !== output) {
        const error = new Error(`Expected "${resultOutput}" to equal "${output}"`);
        error.stack = null;
        throw error;
      }
    });
  });
});
