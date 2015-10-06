var _arity = require('ramda/src/internal/_arity');
var reduce = require('ramda/src/reduce');
var tail = require('ramda/src/tail');

module.exports = function pipeDebug() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }

  var origin;

  try {
    throw new Error();
  } catch (e) {
    origin = e.stack.split('\n')[2].match(/\([^)]+\)/)[0];
  }

  var _pipe = function _pipe(f, g) {
    return function() {
      try {
        return g.call(this, f.apply(this, arguments));
      } catch (e) {
        console.error('Error occurred in pipe at argument', index, origin);
        throw e;
      }
    };
  };

  try {
    return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
  } catch (e) {
    console.error('Failed to create pipe at', origin);
    throw e;
  }
};
