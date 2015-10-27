import spec from './spec';
import Recora from '../../src/';

describe('regression', function() {
  this.slow(8);

  const recora = new Recora('en', {
    utcTime: {
      years: 1970,
      months: 0,
      date: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      timezone: 'UTC',
      timezoneOffset: 0,
    },
  });

  function shittyFixOutputUntilIIncludeRealNumberFormatting(resultToString) {
    return resultToString.replace(/,/g, '');
  }

  spec.forEach(({ description = 'resolve', input, output }) => {
    it(`should ${description} "${input}"`, function() {
      const result = recora.parse(input);
      const resultOutput = result.resultToString;

      if (resultOutput !== shittyFixOutputUntilIIncludeRealNumberFormatting(output) && resultOutput !== output) {
        const error = new Error(`Expected "${resultOutput}" to equal "${output}"\n${JSON.stringify(result)}`);
        error.stack = null;
        throw error;
      }
    });
  });
});
