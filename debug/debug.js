module.exports = function debug(baseFn) {
  return function debugWrapper() {
    var origin;

    try {
      throw new Error();
    } catch (e) {
      origin = e.stack.split('\n')[2].match(/\([^)]+\)/)[0];
    }

    var functions = [].map.call(arguments, function tryCatch(arg, index) {
      if (typeof arg === 'function') {
        return function callee() {
          try {
            arg.apply(null, arguments);
          } catch (e) {
            console.error('Error occurred in', baseFn.name, 'at argument', index, origin);
            throw e;
          }
        };
      }
      return arg;
    });

    return baseFn.apply(null, functions);
  };
};
