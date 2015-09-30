(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["recora"] = factory();
	else
		root["recora"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _parse2 = __webpack_require__(1);
	
	var _parse3 = _interopRequireDefault(_parse2);
	
	var Recora = (function () {
	  function Recora(locale) {
	    _classCallCheck(this, Recora);
	
	    this.locale = locale || 'en';
	    this.constants = {};
	  }
	
	  Recora.prototype.parse = function parse(text) {
	    var locale = this.locale;
	    var constants = this.constants;
	
	    var context = {
	      locale: locale,
	      text: text,
	      constants: constants,
	      hints: null,
	      tags: null,
	      ast: null,
	      conversion: null,
	      result: null,
	      resultToString: ''
	    };
	    return _parse3['default'](context) || context;
	  };
	
	  return Recora;
	})();
	
	exports['default'] = Recora;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(commute, of, pipe, pluck, map, sum, pickBy, whereEq, toPairs, sortBy, update, curry, reduce, reject, isNil, propSatisfies, over, lens, prop, assoc, head, tap, none, test) {'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _locale = __webpack_require__(75);
	
	var _assert = __webpack_require__(87);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _parseParseText = __webpack_require__(92);
	
	var _parseParseText2 = _interopRequireDefault(_parseParseText);
	
	var _parsePreprocessTags = __webpack_require__(93);
	
	var _parsePreprocessTags2 = _interopRequireDefault(_parsePreprocessTags);
	
	var _parsePostprocessTags = __webpack_require__(102);
	
	var _parsePostprocessTags2 = _interopRequireDefault(_parsePostprocessTags);
	
	var _parseResolveTags = __webpack_require__(107);
	
	var _parseResolveTags2 = _interopRequireDefault(_parseResolveTags);
	
	var _resolve = __webpack_require__(157);
	
	var _resolve2 = _interopRequireDefault(_resolve);
	
	var _typesEntity = __webpack_require__(141);
	
	var cartesian = commute(of);
	
	var getDistance = pipe(pluck('index'), map(function (x) {
	  return Math.pow(x, 2);
	}), sum);
	
	var getParseOptions = pipe(pickBy(whereEq({ type: 'PARSE_OPTIONS' })), toPairs, map(function (_ref) {
	  var index = _ref[0];
	  var parseOption = _ref[1];
	  return map(function (value) {
	    return { index: index, value: value };
	  }, parseOption.value);
	}), cartesian, sortBy(getDistance));
	
	var updateTagsWithParseoptions = function updateTagsWithParseoptions(tags, _ref2) {
	  var index = _ref2.index;
	  var value = _ref2.value;
	  return update(Number(index), value, tags);
	};
	
	var transformParseOptions = curry(function (tags, parseOptions) {
	  return reduce(updateTagsWithParseoptions, tags, parseOptions);
	});
	
	function getTagOptions(context) {
	  return pipe(getParseOptions, map(transformParseOptions(context.tags)), map(function (tags) {
	    return _extends({}, context, { tags: tags });
	  }))(context.tags);
	}
	
	var resolveTagOptions = pipe(_parsePostprocessTags2['default'], _parseResolveTags2['default'], _resolve2['default']);
	
	var convertResult = function convertResult(context) {
	  var conversion = context.conversion;
	
	  if (conversion) {
	    var result = undefined;
	
	    if (Array.isArray(conversion)) {
	      result = _typesEntity.convertComposite(context, context.conversion, context.result);
	    } else {
	      result = _typesEntity.convert(context, context.conversion, context.result);
	    }
	
	    return _extends({}, context, { result: result });
	  }
	  return context;
	};
	
	var parseTagsWithOptions = pipe(getTagOptions, map(resolveTagOptions), reject(isNil), reject(propSatisfies(isNil, 'result')), map(convertResult), map(over(lens(prop('result'), assoc('resultToString')), _locale.entityToString)), // FIXME
	head);
	
	var assertNoTextElementInTags = tap(pipe(prop('tags'), pluck('type'), none(test(/^TEXT_/)), _assert2['default']));
	
	var parse = pipe(_parseParseText2['default'], _locale.getFormattingHints, _parsePreprocessTags2['default'], assertNoTextElementInTags, parseTagsWithOptions);
	exports['default'] = parse;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(26), __webpack_require__(27), __webpack_require__(35), __webpack_require__(16), __webpack_require__(37), __webpack_require__(39), __webpack_require__(40), __webpack_require__(49), __webpack_require__(50), __webpack_require__(51), __webpack_require__(54), __webpack_require__(31), __webpack_require__(55), __webpack_require__(60), __webpack_require__(61), __webpack_require__(62), __webpack_require__(63), __webpack_require__(36), __webpack_require__(64), __webpack_require__(65), __webpack_require__(68), __webpack_require__(69), __webpack_require__(73)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var commuteMap = __webpack_require__(3);
	var identity = __webpack_require__(24);
	
	
	/**
	 * Turns a list of Functors into a Functor of a list.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @see R.commuteMap
	 * @sig Functor f => (x -> f x) -> [f a] -> f [a]
	 * @param {Function} of A function that returns the data type to return
	 * @param {Array} list An array of functors of the same type
	 * @return {*}
	 * @example
	 *
	 *      R.commute(R.of, [[1], [2, 3]]);   //=> [[1, 2], [1, 3]]
	 *      R.commute(R.of, [[1, 2], [3]]);   //=> [[1, 3], [2, 3]]
	 *      R.commute(R.of, [[1], [2], [3]]); //=> [[1, 2, 3]]
	 *      R.commute(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
	 *      R.commute(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
	 */
	module.exports = commuteMap(identity);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	var _reduce = __webpack_require__(7);
	var ap = __webpack_require__(13);
	var append = __webpack_require__(23);
	var map = __webpack_require__(16);
	
	
	/**
	 * Turns a list of Functors into a Functor of a list, applying
	 * a mapping function to the elements of the list along the way.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @see R.commute
	 * @sig Functor f => (f a -> f b) -> (x -> f x) -> [f a] -> f [b]
	 * @param {Function} fn The transformation function
	 * @param {Function} of A function that returns the data type to return
	 * @param {Array} list An array of functors of the same type
	 * @return {*}
	 * @example
	 *
	 *      R.commuteMap(R.map(R.add(10)), R.of, [[1], [2, 3]]);   //=> [[11, 12], [11, 13]]
	 *      R.commuteMap(R.map(R.add(10)), R.of, [[1, 2], [3]]);   //=> [[11, 13], [12, 13]]
	 *      R.commuteMap(R.map(R.add(10)), R.of, [[1], [2], [3]]); //=> [[11, 12, 13]]
	 *      R.commuteMap(R.map(R.add(10)), Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([11, 12, 13])
	 *      R.commuteMap(R.map(R.add(10)), Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
	 */
	module.exports = _curry3(function commuteMap(fn, of, list) {
	  function consF(acc, ftor) {
	    return ap(map(append, fn(ftor)), acc);
	  }
	  return _reduce(consF, of([]), list);
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Optimized internal three-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry3(fn) {
	  return function f3(a, b, c) {
	    var n = arguments.length;
	    if (n === 0) {
	      return f3;
	    } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
	      return f3;
	    } else if (n === 1) {
	      return _curry2(function(b, c) { return fn(a, b, c); });
	    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true &&
	                          b != null && b['@@functional/placeholder'] === true) {
	      return f3;
	    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
	      return _curry2(function(a, c) { return fn(a, b, c); });
	    } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
	      return _curry2(function(b, c) { return fn(a, b, c); });
	    } else if (n === 2) {
	      return _curry1(function(c) { return fn(a, b, c); });
	    } else if (n === 3 && a != null && a['@@functional/placeholder'] === true &&
	                          b != null && b['@@functional/placeholder'] === true &&
	                          c != null && c['@@functional/placeholder'] === true) {
	      return f3;
	    } else if (n === 3 && a != null && a['@@functional/placeholder'] === true &&
	                          b != null && b['@@functional/placeholder'] === true) {
	      return _curry2(function(a, b) { return fn(a, b, c); });
	    } else if (n === 3 && a != null && a['@@functional/placeholder'] === true &&
	                          c != null && c['@@functional/placeholder'] === true) {
	      return _curry2(function(a, c) { return fn(a, b, c); });
	    } else if (n === 3 && b != null && b['@@functional/placeholder'] === true &&
	                          c != null && c['@@functional/placeholder'] === true) {
	      return _curry2(function(b, c) { return fn(a, b, c); });
	    } else if (n === 3 && a != null && a['@@functional/placeholder'] === true) {
	      return _curry1(function(a) { return fn(a, b, c); });
	    } else if (n === 3 && b != null && b['@@functional/placeholder'] === true) {
	      return _curry1(function(b) { return fn(a, b, c); });
	    } else if (n === 3 && c != null && c['@@functional/placeholder'] === true) {
	      return _curry1(function(c) { return fn(a, b, c); });
	    } else {
	      return fn(a, b, c);
	    }
	  };
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Optimized internal two-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry1(fn) {
	  return function f1(a) {
	    if (arguments.length === 0) {
	      return f1;
	    } else if (a != null && a['@@functional/placeholder'] === true) {
	      return f1;
	    } else {
	      return fn.apply(this, arguments);
	    }
	  };
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	
	
	/**
	 * Optimized internal two-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */
	module.exports = function _curry2(fn) {
	  return function f2(a, b) {
	    var n = arguments.length;
	    if (n === 0) {
	      return f2;
	    } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
	      return f2;
	    } else if (n === 1) {
	      return _curry1(function(b) { return fn(a, b); });
	    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true &&
	                          b != null && b['@@functional/placeholder'] === true) {
	      return f2;
	    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
	      return _curry1(function(a) { return fn(a, b); });
	    } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
	      return _curry1(function(b) { return fn(a, b); });
	    } else {
	      return fn(a, b);
	    }
	  };
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var _xwrap = __webpack_require__(8);
	var bind = __webpack_require__(9);
	var isArrayLike = __webpack_require__(11);
	
	
	module.exports = (function() {
	  function _arrayReduce(xf, acc, list) {
	    var idx = 0, len = list.length;
	    while (idx < len) {
	      acc = xf['@@transducer/step'](acc, list[idx]);
	      if (acc && acc['@@transducer/reduced']) {
	        acc = acc['@@transducer/value'];
	        break;
	      }
	      idx += 1;
	    }
	    return xf['@@transducer/result'](acc);
	  }
	
	  function _iterableReduce(xf, acc, iter) {
	    var step = iter.next();
	    while (!step.done) {
	      acc = xf['@@transducer/step'](acc, step.value);
	      if (acc && acc['@@transducer/reduced']) {
	        acc = acc['@@transducer/value'];
	        break;
	      }
	      step = iter.next();
	    }
	    return xf['@@transducer/result'](acc);
	  }
	
	  function _methodReduce(xf, acc, obj) {
	    return xf['@@transducer/result'](obj.reduce(bind(xf['@@transducer/step'], xf), acc));
	  }
	
	  var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
	  return function _reduce(fn, acc, list) {
	    if (typeof fn === 'function') {
	      fn = _xwrap(fn);
	    }
	    if (isArrayLike(list)) {
	      return _arrayReduce(fn, acc, list);
	    }
	    if (typeof list.reduce === 'function') {
	      return _methodReduce(fn, acc, list);
	    }
	    if (list[symIterator] != null) {
	      return _iterableReduce(fn, acc, list[symIterator]());
	    }
	    if (typeof list.next === 'function') {
	      return _iterableReduce(fn, acc, list);
	    }
	    throw new TypeError('reduce: list must be array or iterable');
	  };
	})();


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = (function() {
	  function XWrap(fn) {
	    this.f = fn;
	  }
	  XWrap.prototype['@@transducer/init'] = function() {
	    throw new Error('init not implemented on XWrap');
	  };
	  XWrap.prototype['@@transducer/result'] = function(acc) { return acc; };
	  XWrap.prototype['@@transducer/step'] = function(acc, x) {
	    return this.f(acc, x);
	  };
	
	  return function _xwrap(fn) { return new XWrap(fn); };
	}());


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(10);
	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Creates a function that is bound to a context.
	 * Note: `R.bind` does not provide the additional argument-binding capabilities of
	 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @category Object
	 * @see R.partial
	 * @sig (* -> *) -> {*} -> (* -> *)
	 * @param {Function} fn The function to bind to context
	 * @param {Object} thisObj The context to bind `fn` to
	 * @return {Function} A function that will execute in the context of `thisObj`.
	 */
	module.exports = _curry2(function bind(fn, thisObj) {
	  return _arity(fn.length, function() {
	    return fn.apply(thisObj, arguments);
	  });
	});


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function _arity(n, fn) {
	  // jshint unused:vars
	  switch (n) {
	    case 0: return function() { return fn.apply(this, arguments); };
	    case 1: return function(a0) { return fn.apply(this, arguments); };
	    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
	    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
	    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
	    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
	    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
	    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
	    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
	    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
	    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
	    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
	  }
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _isArray = __webpack_require__(12);
	
	
	/**
	 * Tests whether or not an object is similar to an array.
	 *
	 * @func
	 * @memberOf R
	 * @category Type
	 * @category List
	 * @sig * -> Boolean
	 * @param {*} x The object to test.
	 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
	 * @example
	 *
	 *      R.isArrayLike([]); //=> true
	 *      R.isArrayLike(true); //=> false
	 *      R.isArrayLike({}); //=> false
	 *      R.isArrayLike({length: 10}); //=> false
	 *      R.isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
	 */
	module.exports = _curry1(function isArrayLike(x) {
	  if (_isArray(x)) { return true; }
	  if (!x) { return false; }
	  if (typeof x !== 'object') { return false; }
	  if (x instanceof String) { return false; }
	  if (x.nodeType === 1) { return !!x.length; }
	  if (x.length === 0) { return true; }
	  if (x.length > 0) {
	    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
	  }
	  return false;
	});


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Tests whether or not an object is an array.
	 *
	 * @private
	 * @param {*} val The object to test.
	 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
	 * @example
	 *
	 *      _isArray([]); //=> true
	 *      _isArray(null); //=> false
	 *      _isArray({}); //=> false
	 */
	module.exports = Array.isArray || function _isArray(val) {
	  return (val != null &&
	          val.length >= 0 &&
	          Object.prototype.toString.call(val) === '[object Array]');
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(14);
	var _curry2 = __webpack_require__(6);
	var _hasMethod = __webpack_require__(15);
	var _reduce = __webpack_require__(7);
	var map = __webpack_require__(16);
	
	
	/**
	 * ap applies a list of functions to a list of values.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig [f] -> [a] -> [f a]
	 * @param {Array} fns An array of functions
	 * @param {Array} vs An array of values
	 * @return {Array} An array of results of applying each of `fns` to all of `vs` in turn.
	 * @example
	 *
	 *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
	 */
	module.exports = _curry2(function ap(fns, vs) {
	  return _hasMethod('ap', fns) ? fns.ap(vs) : _reduce(function(acc, fn) {
	    return _concat(acc, map(fn, vs));
	  }, [], fns);
	});


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Private `concat` function to merge two array-like objects.
	 *
	 * @private
	 * @param {Array|Arguments} [set1=[]] An array-like object.
	 * @param {Array|Arguments} [set2=[]] An array-like object.
	 * @return {Array} A new, merged array.
	 * @example
	 *
	 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
	 */
	module.exports = function _concat(set1, set2) {
	  set1 = set1 || [];
	  set2 = set2 || [];
	  var idx;
	  var len1 = set1.length;
	  var len2 = set2.length;
	  var result = [];
	
	  idx = 0;
	  while (idx < len1) {
	    result[result.length] = set1[idx];
	    idx += 1;
	  }
	  idx = 0;
	  while (idx < len2) {
	    result[result.length] = set2[idx];
	    idx += 1;
	  }
	  return result;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var _isArray = __webpack_require__(12);
	
	
	/**
	 * Private function that determines whether or not a provided object has a given method.
	 * Does not ignore methods stored on the object's prototype chain. Used for dynamically
	 * dispatching Ramda methods to non-Array objects.
	 *
	 * @private
	 * @param {String} methodName The name of the method to check for.
	 * @param {Object} obj The object to test.
	 * @return {Boolean} `true` has a given method, `false` otherwise.
	 * @example
	 *
	 *      var person = { name: 'John' };
	 *      person.shout = function() { alert(this.name); };
	 *
	 *      _hasMethod('shout', person); //=> true
	 *      _hasMethod('foo', person); //=> false
	 */
	module.exports = function _hasMethod(methodName, obj) {
	  return obj != null && !_isArray(obj) && typeof obj[methodName] === 'function';
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _map = __webpack_require__(20);
	var _xmap = __webpack_require__(21);
	
	
	/**
	 * Returns a new list, constructed by applying the supplied function to every element of the
	 * supplied list.
	 *
	 * Note: `R.map` does not skip deleted or unassigned indices (sparse arrays), unlike the
	 * native `Array.prototype.map` method. For more details on this behavior, see:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Description
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 * @see R.transduce
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> b) -> [a] -> [b]
	 * @param {Function} fn The function to be called on every element of the input `list`.
	 * @param {Array} list The list to be iterated over.
	 * @return {Array} The new list.
	 * @example
	 *
	 *      var double = function(x) {
	 *        return x * 2;
	 *      };
	 *
	 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
	 */
	module.exports = _curry2(_dispatchable('map', _xmap, _map));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var _isArray = __webpack_require__(12);
	var _isTransformer = __webpack_require__(18);
	var _slice = __webpack_require__(19);
	
	
	/**
	 * Returns a function that dispatches with different strategies based on the
	 * object in list position (last argument). If it is an array, executes [fn].
	 * Otherwise, if it has a  function with [methodname], it will execute that
	 * function (functor case). Otherwise, if it is a transformer, uses transducer
	 * [xf] to return a new transformer (transducer case). Otherwise, it will
	 * default to executing [fn].
	 *
	 * @private
	 * @param {String} methodname property to check for a custom implementation
	 * @param {Function} xf transducer to initialize if object is transformer
	 * @param {Function} fn default ramda implementation
	 * @return {Function} A function that dispatches on object in list position
	 */
	module.exports = function _dispatchable(methodname, xf, fn) {
	  return function() {
	    var length = arguments.length;
	    if (length === 0) {
	      return fn();
	    }
	    var obj = arguments[length - 1];
	    if (!_isArray(obj)) {
	      var args = _slice(arguments, 0, length - 1);
	      if (typeof obj[methodname] === 'function') {
	        return obj[methodname].apply(obj, args);
	      }
	      if (_isTransformer(obj)) {
	        var transducer = xf.apply(null, args);
	        return transducer(obj);
	      }
	    }
	    return fn.apply(this, arguments);
	  };
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function _isTransformer(obj) {
	  return typeof obj['@@transducer/step'] === 'function';
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * An optimized, private array `slice` implementation.
	 *
	 * @private
	 * @param {Arguments|Array} args The array or arguments object to consider.
	 * @param {Number} [from=0] The array index to slice from, inclusive.
	 * @param {Number} [to=args.length] The array index to slice to, exclusive.
	 * @return {Array} A new, sliced array.
	 * @example
	 *
	 *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
	 *
	 *      var firstThreeArgs = function(a, b, c, d) {
	 *        return _slice(arguments, 0, 3);
	 *      };
	 *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
	 */
	module.exports = function _slice(args, from, to) {
	  switch (arguments.length) {
	    case 1: return _slice(args, 0, args.length);
	    case 2: return _slice(args, from, args.length);
	    default:
	      var list = [];
	      var idx = 0;
	      var len = Math.max(0, Math.min(args.length, to) - from);
	      while (idx < len) {
	        list[idx] = args[from + idx];
	        idx += 1;
	      }
	      return list;
	  }
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function _map(fn, list) {
	  var idx = 0, len = list.length, result = Array(len);
	  while (idx < len) {
	    result[idx] = fn(list[idx]);
	    idx += 1;
	  }
	  return result;
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _xfBase = __webpack_require__(22);
	
	
	module.exports = (function() {
	  function XMap(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }
	  XMap.prototype['@@transducer/init'] = _xfBase.init;
	  XMap.prototype['@@transducer/result'] = _xfBase.result;
	  XMap.prototype['@@transducer/step'] = function(result, input) {
	    return this.xf['@@transducer/step'](result, this.f(input));
	  };
	
	  return _curry2(function _xmap(f, xf) { return new XMap(f, xf); });
	})();


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = {
	  init: function() {
	    return this.xf['@@transducer/init']();
	  },
	  result: function(result) {
	    return this.xf['@@transducer/result'](result);
	  }
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(14);
	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Returns a new list containing the contents of the given list, followed by the given
	 * element.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig a -> [a] -> [a]
	 * @param {*} el The element to add to the end of the new list.
	 * @param {Array} list The list whose contents will be added to the beginning of the output
	 *        list.
	 * @return {Array} A new list containing the contents of the old list followed by `el`.
	 * @see R.prepend
	 * @example
	 *
	 *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
	 *      R.append('tests', []); //=> ['tests']
	 *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
	 */
	module.exports = _curry2(function append(el, list) {
	  return _concat(list, [el]);
	});


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _identity = __webpack_require__(25);
	
	
	/**
	 * A function that does nothing but return the parameter supplied to it. Good as a default
	 * or placeholder function.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig a -> a
	 * @param {*} x The value to return.
	 * @return {*} The input value, `x`.
	 * @example
	 *
	 *      R.identity(1); //=> 1
	 *
	 *      var obj = {};
	 *      R.identity(obj) === obj; //=> true
	 */
	module.exports = _curry1(_identity);


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = function _identity(x) { return x; };


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	
	
	/**
	 * Returns a singleton array containing the value provided.
	 *
	 * Note this `of` is different from the ES6 `of`; See
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig a -> [a]
	 * @param {*} x any value
	 * @return {Array} An array wrapping `x`.
	 * @example
	 *
	 *      R.of(null); //=> [null]
	 *      R.of([42]); //=> [[42]]
	 */
	module.exports = _curry1(function of(x) { return [x]; });


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var _pipe = __webpack_require__(28);
	var curryN = __webpack_require__(29);
	var reduce = __webpack_require__(31);
	var tail = __webpack_require__(32);
	
	
	/**
	 * Performs left-to-right function composition. The leftmost function may have
	 * any arity; the remaining functions must be unary.
	 *
	 * In some libraries this function is named `sequence`.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> (a -> b -> ... -> n -> z)
	 * @param {...Function} functions
	 * @return {Function}
	 * @see R.compose
	 * @example
	 *
	 *      var f = R.pipe(Math.pow, R.negate, R.inc);
	 *
	 *      f(3, 4); // -(3^4) + 1
	 */
	module.exports = function pipe() {
	  if (arguments.length === 0) {
	    throw new Error('pipe requires at least one argument');
	  }
	  return curryN(arguments[0].length,
	                reduce(_pipe, arguments[0], tail(arguments)));
	};


/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = function _pipe(f, g) {
	  return function() {
	    return g.call(this, f.apply(this, arguments));
	  };
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(10);
	var _curry1 = __webpack_require__(5);
	var _curry2 = __webpack_require__(6);
	var _curryN = __webpack_require__(30);
	
	
	/**
	 * Returns a curried equivalent of the provided function, with the
	 * specified arity. The curried function has two unusual capabilities.
	 * First, its arguments needn't be provided one at a time. If `g` is
	 * `R.curryN(3, f)`, the following are equivalent:
	 *
	 *   - `g(1)(2)(3)`
	 *   - `g(1)(2, 3)`
	 *   - `g(1, 2)(3)`
	 *   - `g(1, 2, 3)`
	 *
	 * Secondly, the special placeholder value `R.__` may be used to specify
	 * "gaps", allowing partial application of any combination of arguments,
	 * regardless of their positions. If `g` is as above and `_` is `R.__`,
	 * the following are equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig Number -> (* -> a) -> (* -> a)
	 * @param {Number} length The arity for the returned function.
	 * @param {Function} fn The function to curry.
	 * @return {Function} A new, curried function.
	 * @see R.curry
	 * @example
	 *
	 *      var addFourNumbers = function() {
	 *        return R.sum([].slice.call(arguments, 0, 4));
	 *      };
	 *
	 *      var curriedAddFourNumbers = R.curryN(4, addFourNumbers);
	 *      var f = curriedAddFourNumbers(1, 2);
	 *      var g = f(3);
	 *      g(4); //=> 10
	 */
	module.exports = _curry2(function curryN(length, fn) {
	  if (length === 1) {
	    return _curry1(fn);
	  }
	  return _arity(length, _curryN(length, [], fn));
	});


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(10);
	
	
	/**
	 * Internal curryN function.
	 *
	 * @private
	 * @category Function
	 * @param {Number} length The arity of the curried function.
	 * @return {array} An array of arguments received thus far.
	 * @param {Function} fn The function to curry.
	 */
	module.exports = function _curryN(length, received, fn) {
	  return function() {
	    var combined = [];
	    var argsIdx = 0;
	    var left = length;
	    var combinedIdx = 0;
	    while (combinedIdx < received.length || argsIdx < arguments.length) {
	      var result;
	      if (combinedIdx < received.length &&
	          (received[combinedIdx] == null ||
	           received[combinedIdx]['@@functional/placeholder'] !== true ||
	           argsIdx >= arguments.length)) {
	        result = received[combinedIdx];
	      } else {
	        result = arguments[argsIdx];
	        argsIdx += 1;
	      }
	      combined[combinedIdx] = result;
	      if (result == null || result['@@functional/placeholder'] !== true) {
	        left -= 1;
	      }
	      combinedIdx += 1;
	    }
	    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
	  };
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	var _reduce = __webpack_require__(7);
	
	
	/**
	 * Returns a single item by iterating through the list, successively calling the iterator
	 * function and passing it an accumulator value and the current value from the array, and
	 * then passing the result to the next call.
	 *
	 * The iterator function receives two values: *(acc, value)*.  It may use `R.reduced` to
	 * shortcut the iteration.
	 *
	 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse arrays), unlike
	 * the native `Array.prototype.reduce` method. For more details on this behavior, see:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
	 * @see R.reduced
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a,b -> a) -> a -> [b] -> a
	 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	 *        current element from the array.
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @example
	 *
	 *      var numbers = [1, 2, 3];
	 *      var add = function(a, b) {
	 *        return a + b;
	 *      };
	 *
	 *      R.reduce(add, 10, numbers); //=> 16
	 */
	module.exports = _curry3(_reduce);


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(33);
	var slice = __webpack_require__(34);
	
	
	/**
	 * Returns all but the first element of the given list or string (or object
	 * with a `tail` method).
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @see R.head, R.init, R.last
	 * @sig [a] -> [a]
	 * @sig String -> String
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      R.tail([1, 2, 3]);  //=> [2, 3]
	 *      R.tail([1, 2]);     //=> [2]
	 *      R.tail([1]);        //=> []
	 *      R.tail([]);         //=> []
	 *
	 *      R.tail('abc');  //=> 'bc'
	 *      R.tail('ab');   //=> 'b'
	 *      R.tail('a');    //=> ''
	 *      R.tail('');     //=> ''
	 */
	module.exports = _checkForMethod('tail', slice(1, Infinity));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var _isArray = __webpack_require__(12);
	var _slice = __webpack_require__(19);
	
	
	/**
	 * Similar to hasMethod, this checks whether a function has a [methodname]
	 * function. If it isn't an array it will execute that function otherwise it will
	 * default to the ramda implementation.
	 *
	 * @private
	 * @param {Function} fn ramda implemtation
	 * @param {String} methodname property to check for a custom implementation
	 * @return {Object} Whatever the return value of the method is.
	 */
	module.exports = function _checkForMethod(methodname, fn) {
	  return function() {
	    var length = arguments.length;
	    if (length === 0) {
	      return fn();
	    }
	    var obj = arguments[length - 1];
	    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
	      fn.apply(this, arguments) :
	      obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
	  };
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var _checkForMethod = __webpack_require__(33);
	var _curry3 = __webpack_require__(4);
	
	
	/**
	 * Returns the elements of the given list or string (or object with a `slice`
	 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig Number -> Number -> [a] -> [a]
	 * @sig Number -> Number -> String -> String
	 * @param {Number} fromIndex The start index (inclusive).
	 * @param {Number} toIndex The end index (exclusive).
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
	 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
	 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
	 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
	 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
	 */
	module.exports = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
	  return Array.prototype.slice.call(list, fromIndex, toIndex);
	}));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var map = __webpack_require__(16);
	var prop = __webpack_require__(36);
	
	
	/**
	 * Returns a new list by plucking the same named property off all objects in the list supplied.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig k -> [{k: v}] -> [v]
	 * @param {Number|String} key The key name to pluck off of each object.
	 * @param {Array} list The array to consider.
	 * @return {Array} The list of values for the given key.
	 * @example
	 *
	 *      R.pluck('a')([{a: 1}, {a: 2}]); //=> [1, 2]
	 *      R.pluck(0)([[1, 2], [3, 4]]);   //=> [1, 3]
	 */
	module.exports = _curry2(function pluck(p, list) {
	  return map(prop(p), list);
	});


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Returns a function that when supplied an object returns the indicated property of that object, if it exists.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig s -> {s: a} -> a | Undefined
	 * @param {String} p The property name
	 * @param {Object} obj The object to query
	 * @return {*} The value at `obj.p`.
	 * @example
	 *
	 *      R.prop('x', {x: 100}); //=> 100
	 *      R.prop('x', {}); //=> undefined
	 */
	module.exports = _curry2(function prop(p, obj) { return obj[p]; });


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var add = __webpack_require__(38);
	var reduce = __webpack_require__(31);
	
	
	/**
	 * Adds together all the elements of a list.
	 *
	 * @func
	 * @memberOf R
	 * @category Math
	 * @sig [Number] -> Number
	 * @param {Array} list An array of numbers
	 * @return {Number} The sum of all the numbers in the list.
	 * @see R.reduce
	 * @example
	 *
	 *      R.sum([2,4,6,8,100,1]); //=> 121
	 */
	module.exports = reduce(add, 0);


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Adds two numbers. Equivalent to `a + b` but curried.
	 *
	 * @func
	 * @memberOf R
	 * @category Math
	 * @sig Number -> Number -> Number
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 * @see R.subtract
	 * @example
	 *
	 *      R.add(2, 3);       //=>  5
	 *      R.add(7)(10);      //=> 17
	 */
	module.exports = _curry2(function add(a, b) { return a + b; });


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Returns a partial copy of an object containing only the keys that
	 * satisfy the supplied predicate.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig (v, k -> Boolean) -> {k: v} -> {k: v}
	 * @param {Function} pred A predicate to determine whether or not a key
	 *        should be included on the output object.
	 * @param {Object} obj The object to copy from
	 * @return {Object} A new object with only properties that satisfy `pred`
	 *         on it.
	 * @see R.pick
	 * @example
	 *
	 *      var isUpperCase = function(val, key) { return key.toUpperCase() === key; }
	 *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
	 */
	module.exports = _curry2(function pickBy(test, obj) {
	  var result = {};
	  for (var prop in obj) {
	    if (test(obj[prop], prop, obj)) {
	      result[prop] = obj[prop];
	    }
	  }
	  return result;
	});


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var equals = __webpack_require__(41);
	var mapObj = __webpack_require__(47);
	var where = __webpack_require__(48);
	
	
	/**
	 * Takes a spec object and a test object; returns true if the test satisfies
	 * the spec, false otherwise. An object satisfies the spec if, for each of the
	 * spec's own properties, accessing that property of the object gives the same
	 * value (in `R.equals` terms) as accessing that property of the spec.
	 *
	 * `whereEq` is a specialization of [`where`](#where).
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig {String: *} -> {String: *} -> Boolean
	 * @param {Object} spec
	 * @param {Object} testObj
	 * @return {Boolean}
	 * @see R.where
	 * @example
	 *
	 *      // pred :: Object -> Boolean
	 *      var pred = R.whereEq({a: 1, b: 2});
	 *
	 *      pred({a: 1});              //=> false
	 *      pred({a: 1, b: 2});        //=> true
	 *      pred({a: 1, b: 2, c: 3});  //=> true
	 *      pred({a: 1, b: 1});        //=> false
	 */
	module.exports = _curry2(function whereEq(spec, testObj) {
	  return where(mapObj(equals, spec), testObj);
	});


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _equals = __webpack_require__(42);
	var _hasMethod = __webpack_require__(15);
	
	
	/**
	 * Returns `true` if its arguments are equivalent, `false` otherwise.
	 * Dispatches to an `equals` method if present. Handles cyclical data
	 * structures.
	 *
	 * @func
	 * @memberOf R
	 * @category Relation
	 * @sig a -> b -> Boolean
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 * @example
	 *
	 *      R.equals(1, 1); //=> true
	 *      R.equals(1, '1'); //=> false
	 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
	 *
	 *      var a = {}; a.v = a;
	 *      var b = {}; b.v = b;
	 *      R.equals(a, b); //=> true
	 */
	module.exports = _curry2(function equals(a, b) {
	  return _hasMethod('equals', a) ? a.equals(b) :
	         _hasMethod('equals', b) ? b.equals(a) : _equals(a, b, [], []);
	});


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var _has = __webpack_require__(43);
	var identical = __webpack_require__(44);
	var keys = __webpack_require__(45);
	var type = __webpack_require__(46);
	
	// The algorithm used to handle cyclic structures is
	// inspired by underscore's isEqual
	module.exports = function _equals(a, b, stackA, stackB) {
	  var typeA = type(a);
	  if (typeA !== type(b)) {
	    return false;
	  }
	
	  if (typeA === 'Boolean' || typeA === 'Number' || typeA === 'String') {
	    return typeof a === 'object' ?
	      typeof b === 'object' && identical(a.valueOf(), b.valueOf()) :
	      identical(a, b);
	  }
	
	  if (identical(a, b)) {
	    return true;
	  }
	
	  if (typeA === 'RegExp') {
	    // RegExp equality algorithm: http://stackoverflow.com/a/10776635
	    return (a.source === b.source) &&
	           (a.global === b.global) &&
	           (a.ignoreCase === b.ignoreCase) &&
	           (a.multiline === b.multiline) &&
	           (a.sticky === b.sticky) &&
	           (a.unicode === b.unicode);
	  }
	
	  if (Object(a) === a) {
	    if (typeA === 'Date' && a.getTime() !== b.getTime()) {
	      return false;
	    }
	
	    var keysA = keys(a);
	    if (keysA.length !== keys(b).length) {
	      return false;
	    }
	
	    var idx = stackA.length - 1;
	    while (idx >= 0) {
	      if (stackA[idx] === a) {
	        return stackB[idx] === b;
	      }
	      idx -= 1;
	    }
	
	    stackA[stackA.length] = a;
	    stackB[stackB.length] = b;
	    idx = keysA.length - 1;
	    while (idx >= 0) {
	      var key = keysA[idx];
	      if (!_has(key, b) || !_equals(b[key], a[key], stackA, stackB)) {
	        return false;
	      }
	      idx -= 1;
	    }
	    stackA.pop();
	    stackB.pop();
	    return true;
	  }
	  return false;
	};


/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = function _has(prop, obj) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Returns true if its arguments are identical, false otherwise. Values are
	 * identical if they reference the same memory. `NaN` is identical to `NaN`;
	 * `0` and `-0` are not identical.
	 *
	 * @func
	 * @memberOf R
	 * @category Relation
	 * @sig a -> a -> Boolean
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 * @example
	 *
	 *      var o = {};
	 *      R.identical(o, o); //=> true
	 *      R.identical(1, 1); //=> true
	 *      R.identical(1, '1'); //=> false
	 *      R.identical([], []); //=> false
	 *      R.identical(0, -0); //=> false
	 *      R.identical(NaN, NaN); //=> true
	 */
	module.exports = _curry2(function identical(a, b) {
	  // SameValue algorithm
	  if (a === b) { // Steps 1-5, 7-10
	    // Steps 6.b-6.e: +0 != -0
	    return a !== 0 || 1 / a === 1 / b;
	  } else {
	    // Step 6.a: NaN == NaN
	    return a !== a && b !== b;
	  }
	});


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _has = __webpack_require__(43);
	
	
	/**
	 * Returns a list containing the names of all the enumerable own
	 * properties of the supplied object.
	 * Note that the order of the output array is not guaranteed to be
	 * consistent across different JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig {k: v} -> [k]
	 * @param {Object} obj The object to extract properties from
	 * @return {Array} An array of the object's own properties.
	 * @example
	 *
	 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
	 */
	module.exports = (function() {
	  // cover IE < 9 keys issues
	  var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
	                            'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	
	  var contains = function contains(list, item) {
	    var idx = 0;
	    while (idx < list.length) {
	      if (list[idx] === item) {
	        return true;
	      }
	      idx += 1;
	    }
	    return false;
	  };
	
	  return typeof Object.keys === 'function' ?
	    _curry1(function keys(obj) {
	      return Object(obj) !== obj ? [] : Object.keys(obj);
	    }) :
	    _curry1(function keys(obj) {
	      if (Object(obj) !== obj) {
	        return [];
	      }
	      var prop, ks = [], nIdx;
	      for (prop in obj) {
	        if (_has(prop, obj)) {
	          ks[ks.length] = prop;
	        }
	      }
	      if (hasEnumBug) {
	        nIdx = nonEnumerableProps.length - 1;
	        while (nIdx >= 0) {
	          prop = nonEnumerableProps[nIdx];
	          if (_has(prop, obj) && !contains(ks, prop)) {
	            ks[ks.length] = prop;
	          }
	          nIdx -= 1;
	        }
	      }
	      return ks;
	    });
	}());


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	
	
	/**
	 * Gives a single-word string description of the (native) type of a value, returning such
	 * answers as 'Object', 'Number', 'Array', or 'Null'.  Does not attempt to distinguish user
	 * Object types any further, reporting them all as 'Object'.
	 *
	 * @func
	 * @memberOf R
	 * @category Type
	 * @sig (* -> {*}) -> String
	 * @param {*} val The value to test
	 * @return {String}
	 * @example
	 *
	 *      R.type({}); //=> "Object"
	 *      R.type(1); //=> "Number"
	 *      R.type(false); //=> "Boolean"
	 *      R.type('s'); //=> "String"
	 *      R.type(null); //=> "Null"
	 *      R.type([]); //=> "Array"
	 *      R.type(/[A-z]/); //=> "RegExp"
	 */
	module.exports = _curry1(function type(val) {
	  return val === null      ? 'Null'      :
	         val === undefined ? 'Undefined' :
	         Object.prototype.toString.call(val).slice(8, -1);
	});


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _reduce = __webpack_require__(7);
	var keys = __webpack_require__(45);
	
	
	/**
	 * Map, but for objects. Creates an object with the same keys as `obj` and values
	 * generated by running each property of `obj` through `fn`. `fn` is passed one argument:
	 * *(value)*.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig (v -> v) -> {k: v} -> {k: v}
	 * @param {Function} fn A function called for each property in `obj`. Its return value will
	 * become a new property on the return object.
	 * @param {Object} obj The object to iterate over.
	 * @return {Object} A new object with the same keys as `obj` and values that are the result
	 *         of running each property through `fn`.
	 * @example
	 *
	 *      var values = { x: 1, y: 2, z: 3 };
	 *      var double = function(num) {
	 *        return num * 2;
	 *      };
	 *
	 *      R.mapObj(double, values); //=> { x: 2, y: 4, z: 6 }
	 */
	module.exports = _curry2(function mapObj(fn, obj) {
	  return _reduce(function(acc, key) {
	    acc[key] = fn(obj[key]);
	    return acc;
	  }, {}, keys(obj));
	});


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _has = __webpack_require__(43);
	
	
	/**
	 * Takes a spec object and a test object; returns true if the test satisfies
	 * the spec. Each of the spec's own properties must be a predicate function.
	 * Each predicate is applied to the value of the corresponding property of
	 * the test object. `where` returns true if all the predicates return true,
	 * false otherwise.
	 *
	 * `where` is well suited to declaratively expressing constraints for other
	 * functions such as `filter` and `find`.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
	 * @param {Object} spec
	 * @param {Object} testObj
	 * @return {Boolean}
	 * @example
	 *
	 *      // pred :: Object -> Boolean
	 *      var pred = R.where({
	 *        a: R.equals('foo'),
	 *        b: R.complement(R.equals('bar')),
	 *        x: R.gt(_, 10),
	 *        y: R.lt(_, 20)
	 *      });
	 *
	 *      pred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true
	 *      pred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false
	 *      pred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false
	 *      pred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false
	 *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false
	 */
	module.exports = _curry2(function where(spec, testObj) {
	  for (var prop in spec) {
	    if (_has(prop, spec) && !spec[prop](testObj[prop])) {
	      return false;
	    }
	  }
	  return true;
	});


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _has = __webpack_require__(43);
	
	
	/**
	 * Converts an object into an array of key, value arrays.
	 * Only the object's own properties are used.
	 * Note that the order of the output array is not guaranteed to be
	 * consistent across different JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig {String: *} -> [[String,*]]
	 * @param {Object} obj The object to extract from
	 * @return {Array} An array of key, value arrays from the object's own properties.
	 * @see R.fromPairs
	 * @example
	 *
	 *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
	 */
	module.exports = _curry1(function toPairs(obj) {
	  var pairs = [];
	  for (var prop in obj) {
	    if (_has(prop, obj)) {
	      pairs[pairs.length] = [prop, obj[prop]];
	    }
	  }
	  return pairs;
	});


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _slice = __webpack_require__(19);
	
	
	/**
	 * Sorts the list according to the supplied function.
	 *
	 * @func
	 * @memberOf R
	 * @category Relation
	 * @sig Ord b => (a -> b) -> [a] -> [a]
	 * @param {Function} fn
	 * @param {Array} list The list to sort.
	 * @return {Array} A new list sorted by the keys generated by `fn`.
	 * @example
	 *
	 *      var sortByFirstItem = R.sortBy(prop(0));
	 *      var sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));
	 *      var pairs = [[-1, 1], [-2, 2], [-3, 3]];
	 *      sortByFirstItem(pairs); //=> [[-3, 3], [-2, 2], [-1, 1]]
	 *      var alice = {
	 *        name: 'ALICE',
	 *        age: 101
	 *      };
	 *      var bob = {
	 *        name: 'Bob',
	 *        age: -10
	 *      };
	 *      var clara = {
	 *        name: 'clara',
	 *        age: 314.159
	 *      };
	 *      var people = [clara, bob, alice];
	 *      sortByNameCaseInsensitive(people); //=> [alice, bob, clara]
	 */
	module.exports = _curry2(function sortBy(fn, list) {
	  return _slice(list).sort(function(a, b) {
	    var aa = fn(a);
	    var bb = fn(b);
	    return aa < bb ? -1 : aa > bb ? 1 : 0;
	  });
	});


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	var adjust = __webpack_require__(52);
	var always = __webpack_require__(53);
	
	/**
	 * Returns a new copy of the array with the element at the
	 * provided index replaced with the given value.
	 * @see R.adjust
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig Number -> a -> [a] -> [a]
	 * @param {Number} idx The index to update.
	 * @param {*} x The value to exist at the given index of the returned array.
	 * @param {Array|Arguments} list The source array-like object to be updated.
	 * @return {Array} A copy of `list` with the value at index `idx` replaced with `x`.
	 * @example
	 *
	 *      R.update(1, 11, [0, 1, 2]);     //=> [0, 11, 2]
	 *      R.update(1)(11)([0, 1, 2]);     //=> [0, 11, 2]
	 */
	module.exports = _curry3(function update(idx, x, list) {
	  return adjust(always(x), idx, list);
	});


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(14);
	var _curry3 = __webpack_require__(4);
	
	/**
	 * Applies a function to the value at the given index of an array,
	 * returning a new copy of the array with the element at the given
	 * index replaced with the result of the function application.
	 * @see R.update
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> a) -> Number -> [a] -> [a]
	 * @param {Function} fn The function to apply.
	 * @param {Number} idx The index.
	 * @param {Array|Arguments} list An array-like object whose value
	 *        at the supplied index will be replaced.
	 * @return {Array} A copy of the supplied array-like object with
	 *         the element at index `idx` replaced with the value
	 *         returned by applying `fn` to the existing element.
	 * @example
	 *
	 *      R.adjust(R.add(10), 1, [0, 1, 2]);     //=> [0, 11, 2]
	 *      R.adjust(R.add(10))(1)([0, 1, 2]);     //=> [0, 11, 2]
	 */
	module.exports = _curry3(function adjust(fn, idx, list) {
	  if (idx >= list.length || idx < -list.length) {
	    return list;
	  }
	  var start = idx < 0 ? list.length : 0;
	  var _idx = start + idx;
	  var _list = _concat(list);
	  _list[_idx] = fn(list[_idx]);
	  return _list;
	});


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	
	
	/**
	 * Returns a function that always returns the given value. Note that for
	 * non-primitives the value returned is a reference to the original value.
	 *
	 * This function is known as `const`, `constant`, or `K` (for K combinator)
	 * in other languages and libraries.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig a -> (* -> a)
	 * @param {*} val The value to wrap in a function
	 * @return {Function} A Function :: * -> val.
	 * @example
	 *
	 *      var t = R.always('Tee');
	 *      t(); //=> 'Tee'
	 */
	module.exports = _curry1(function always(val) {
	  return function() {
	    return val;
	  };
	});


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var curryN = __webpack_require__(29);
	
	
	/**
	 * Returns a curried equivalent of the provided function. The curried
	 * function has two unusual capabilities. First, its arguments needn't
	 * be provided one at a time. If `f` is a ternary function and `g` is
	 * `R.curry(f)`, the following are equivalent:
	 *
	 *   - `g(1)(2)(3)`
	 *   - `g(1)(2, 3)`
	 *   - `g(1, 2)(3)`
	 *   - `g(1, 2, 3)`
	 *
	 * Secondly, the special placeholder value `R.__` may be used to specify
	 * "gaps", allowing partial application of any combination of arguments,
	 * regardless of their positions. If `g` is as above and `_` is `R.__`,
	 * the following are equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig (* -> a) -> (* -> a)
	 * @param {Function} fn The function to curry.
	 * @return {Function} A new, curried function.
	 * @see R.curryN
	 * @example
	 *
	 *      var addFourNumbers = function(a, b, c, d) {
	 *        return a + b + c + d;
	 *      };
	 *
	 *      var curriedAddFourNumbers = R.curry(addFourNumbers);
	 *      var f = curriedAddFourNumbers(1, 2);
	 *      var g = f(3);
	 *      g(4); //=> 10
	 */
	module.exports = _curry1(function curry(fn) {
	  return curryN(fn.length, fn);
	});


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var _complement = __webpack_require__(56);
	var _curry2 = __webpack_require__(6);
	var filter = __webpack_require__(57);
	
	
	/**
	 * Similar to `filter`, except that it keeps only values for which the given predicate
	 * function returns falsy. The predicate function is passed one argument: *(value)*.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 * @see R.transduce
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} fn The function called per iteration.
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} The new filtered array.
	 * @see R.filter
	 * @example
	 *
	 *      var isOdd = function(n) {
	 *        return n % 2 === 1;
	 *      };
	 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
	 */
	module.exports = _curry2(function reject(fn, list) {
	  return filter(_complement(fn), list);
	});


/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = function _complement(f) {
	  return function() {
	    return !f.apply(this, arguments);
	  };
	};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _filter = __webpack_require__(58);
	var _xfilter = __webpack_require__(59);
	
	
	/**
	 * Returns a new list containing only those items that match a given predicate function.
	 * The predicate function is passed one argument: *(value)*.
	 *
	 * Note that `R.filter` does not skip deleted or unassigned indices, unlike the native
	 * `Array.prototype.filter` method. For more details on this behavior, see:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Description
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 * @see R.transduce
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} fn The function called per iteration.
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} The new filtered array.
	 * @see R.reject
	 * @example
	 *
	 *      var isEven = function(n) {
	 *        return n % 2 === 0;
	 *      };
	 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
	 */
	module.exports = _curry2(_dispatchable('filter', _xfilter, _filter));


/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = function _filter(fn, list) {
	  var idx = 0, len = list.length, result = [];
	  while (idx < len) {
	    if (fn(list[idx])) {
	      result[result.length] = list[idx];
	    }
	    idx += 1;
	  }
	  return result;
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _xfBase = __webpack_require__(22);
	
	
	module.exports = (function() {
	  function XFilter(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }
	  XFilter.prototype['@@transducer/init'] = _xfBase.init;
	  XFilter.prototype['@@transducer/result'] = _xfBase.result;
	  XFilter.prototype['@@transducer/step'] = function(result, input) {
	    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
	  };
	
	  return _curry2(function _xfilter(f, xf) { return new XFilter(f, xf); });
	})();


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	
	
	/**
	 * Checks if the input value is `null` or `undefined`.
	 *
	 * @func
	 * @memberOf R
	 * @category Type
	 * @sig * -> Boolean
	 * @param {*} x The value to test.
	 * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
	 * @example
	 *
	 *      R.isNil(null); //=> true
	 *      R.isNil(undefined); //=> true
	 *      R.isNil(0); //=> false
	 *      R.isNil([]); //=> false
	 */
	module.exports = _curry1(function isNil(x) { return x == null; });


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	
	
	/**
	 * Returns `true` if the specified object property satisfies the given
	 * predicate; `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @category Logic
	 * @sig (a -> Boolean) -> String -> {String: a} -> Boolean
	 * @param {Function} pred
	 * @param {String} name
	 * @param {*} obj
	 * @return {Boolean}
	 * @see R.propEq
	 * @see R.propIs
	 * @example
	 *
	 *      R.propSatisfies(x => x > 0, 'x', {x: 1, y: 2}); //=> true
	 */
	module.exports = _curry3(function propSatisfies(pred, name, obj) {
	  return pred(obj[name]);
	});


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	
	
	/**
	 * Returns the result of "setting" the portion of the given data structure
	 * focused by the given lens to the given value.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @typedef Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig Lens s a -> (a -> a) -> s -> s
	 * @param {Lens} lens
	 * @param {*} v
	 * @param {*} x
	 * @return {*}
	 * @see R.prop, R.lensIndex, R.lensProp
	 * @example
	 *
	 *      var headLens = R.lensIndex(0);
	 *
	 *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
	 */
	module.exports = (function() {
	  var Identity = function(x) {
	    return {value: x, map: function(f) { return Identity(f(x)); }};
	  };
	
	  return _curry3(function over(lens, f, x) {
	    return lens(function(y) { return Identity(f(y)); })(x).value;
	  });
	}());


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var map = __webpack_require__(16);
	
	
	/**
	 * Returns a lens for the given getter and setter functions. The getter "gets"
	 * the value of the focus; the setter "sets" the value of the focus. The setter
	 * should not mutate the data structure.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @typedef Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
	 * @param {Function} getter
	 * @param {Function} setter
	 * @return {Lens}
	 * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
	 * @example
	 *
	 *      var xLens = R.lens(R.prop('x'), R.assoc('x'));
	 *
	 *      R.view(xLens, {x: 1, y: 2});            //=> 1
	 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
	 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
	 */
	module.exports = _curry2(function lens(getter, setter) {
	  return function(f) {
	    return function(s) {
	      return map(function(v) { return setter(v, s); }, f(getter(s)));
	    };
	  };
	});


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	
	
	/**
	 * Makes a shallow clone of an object, setting or overriding the specified
	 * property with the given value.  Note that this copies and flattens
	 * prototype properties onto the new object as well.  All non-primitive
	 * properties are copied by reference.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig String -> a -> {k: v} -> {k: v}
	 * @param {String} prop the property name to set
	 * @param {*} val the new value
	 * @param {Object} obj the object to clone
	 * @return {Object} a new object similar to the original except for the specified property.
	 * @see R.dissoc
	 * @example
	 *
	 *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
	 */
	module.exports = _curry3(function assoc(prop, val, obj) {
	  var result = {};
	  for (var p in obj) {
	    result[p] = obj[p];
	  }
	  result[prop] = val;
	  return result;
	});


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var nth = __webpack_require__(66);
	
	
	/**
	 * Returns the first element of the given list or string. In some libraries
	 * this function is named `first`.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @see R.tail, R.init, R.last
	 * @sig [a] -> a | Undefined
	 * @sig String -> String
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
	 *      R.head([]); //=> undefined
	 *
	 *      R.head('abc'); //=> 'a'
	 *      R.head(''); //=> ''
	 */
	module.exports = nth(0);


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _isString = __webpack_require__(67);
	
	
	/**
	 * Returns the nth element of the given list or string.
	 * If n is negative the element at index length + n is returned.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig Number -> [a] -> a | Undefined
	 * @sig Number -> String -> String
	 * @param {Number} offset
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      var list = ['foo', 'bar', 'baz', 'quux'];
	 *      R.nth(1, list); //=> 'bar'
	 *      R.nth(-1, list); //=> 'quux'
	 *      R.nth(-99, list); //=> undefined
	 *
	 *      R.nth('abc', 2); //=> 'c'
	 *      R.nth('abc', 3); //=> ''
	 */
	module.exports = _curry2(function nth(offset, list) {
	  var idx = offset < 0 ? list.length + offset : offset;
	  return _isString(list) ? list.charAt(idx) : list[idx];
	});


/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = function _isString(x) {
	  return Object.prototype.toString.call(x) === '[object String]';
	};


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Runs the given function with the supplied object, then returns the object.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig (a -> *) -> a -> a
	 * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
	 * @param {*} x
	 * @return {*} `x`.
	 * @example
	 *
	 *      var sayX = function(x) { console.log('x is ' + x); };
	 *      R.tap(sayX, 100); //=> 100
	 *      //-> 'x is 100'
	 */
	module.exports = _curry2(function tap(fn, x) {
	  fn(x);
	  return x;
	});


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var _complement = __webpack_require__(56);
	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _xany = __webpack_require__(70);
	var any = __webpack_require__(72);
	
	
	/**
	 * Returns `true` if no elements of the list match the predicate,
	 * `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> Boolean
	 * @param {Function} fn The predicate function.
	 * @param {Array} list The array to consider.
	 * @return {Boolean} `true` if the predicate is not satisfied by every element, `false` otherwise.
	 * @see R.all, R.any
	 * @example
	 *
	 *      R.none(R.isNaN, [1, 2, 3]); //=> true
	 *      R.none(R.isNaN, [1, 2, 3, NaN]); //=> false
	 */
	module.exports = _curry2(_complement(_dispatchable('any', _xany, any)));


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _reduced = __webpack_require__(71);
	var _xfBase = __webpack_require__(22);
	
	
	module.exports = (function() {
	  function XAny(f, xf) {
	    this.xf = xf;
	    this.f = f;
	    this.any = false;
	  }
	  XAny.prototype['@@transducer/init'] = _xfBase.init;
	  XAny.prototype['@@transducer/result'] = function(result) {
	    if (!this.any) {
	      result = this.xf['@@transducer/step'](result, false);
	    }
	    return this.xf['@@transducer/result'](result);
	  };
	  XAny.prototype['@@transducer/step'] = function(result, input) {
	    if (this.f(input)) {
	      this.any = true;
	      result = _reduced(this.xf['@@transducer/step'](result, true));
	    }
	    return result;
	  };
	
	  return _curry2(function _xany(f, xf) { return new XAny(f, xf); });
	})();


/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = function _reduced(x) {
	  return x && x['@@transducer/reduced'] ? x :
	    {
	      '@@transducer/value': x,
	      '@@transducer/reduced': true
	    };
	};


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _xany = __webpack_require__(70);
	
	
	/**
	 * Returns `true` if at least one of elements of the list match the predicate, `false`
	 * otherwise.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 * @see R.transduce
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> Boolean
	 * @param {Function} fn The predicate function.
	 * @param {Array} list The array to consider.
	 * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
	 *         otherwise.
	 * @see R.all, R.none
	 * @example
	 *
	 *      var lessThan0 = R.flip(R.lt)(0);
	 *      var lessThan2 = R.flip(R.lt)(2);
	 *      R.any(lessThan0)([1, 2]); //=> false
	 *      R.any(lessThan2)([1, 2]); //=> true
	 */
	module.exports = _curry2(_dispatchable('any', _xany, function any(fn, list) {
	  var idx = 0;
	  while (idx < list.length) {
	    if (fn(list[idx])) {
	      return true;
	    }
	    idx += 1;
	  }
	  return false;
	}));


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var _cloneRegExp = __webpack_require__(74);
	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Determines whether a given string matches a given regular expression.
	 *
	 * @func
	 * @memberOf R
	 * @see R.match
	 * @category String
	 * @sig RegExp -> String -> Boolean
	 * @param {RegExp} pattern
	 * @param {String} str
	 * @return {Boolean}
	 * @example
	 *
	 *      R.test(/^x/, 'xyz'); //=> true
	 *      R.test(/^y/, 'xyz'); //=> false
	 */
	module.exports = _curry2(function test(pattern, str) {
	  return _cloneRegExp(pattern).test(str);
	});


/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = function _cloneRegExp(pattern) {
	  return new RegExp(pattern.source, (pattern.global     ? 'g' : '') +
	                                    (pattern.ignoreCase ? 'i' : '') +
	                                    (pattern.multiline  ? 'm' : '') +
	                                    (pattern.sticky     ? 'y' : '') +
	                                    (pattern.unicode    ? 'u' : ''));
	};


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(invert, last, init, always, merge, identity, pipe, head, equals, keys, isEmpty, reduce, toPairs, partial) {'use strict';
	
	exports.__esModule = true;
	exports.getSiUnit = getSiUnit;
	exports.getUnitValue = getUnitValue;
	exports.getUnit = getUnit;
	exports.entityToString = entityToString;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _dataEnvironmentUnits = __webpack_require__(83);
	
	var _dataEnvironmentUnits2 = _interopRequireDefault(_dataEnvironmentUnits);
	
	var _dataEnvironmentSi = __webpack_require__(84);
	
	var _dataEnvironmentSi2 = _interopRequireDefault(_dataEnvironmentSi);
	
	var _dataEnAbbreviations = __webpack_require__(85);
	
	var _dataEnAbbreviations2 = _interopRequireDefault(_dataEnAbbreviations);
	
	var _dataEnUnitFormatting = __webpack_require__(86);
	
	var _dataEnUnitFormatting2 = _interopRequireDefault(_dataEnUnitFormatting);
	
	// TODO: JSON
	var pluralMap = {
	  'century': 'centuries',
	  'inch': 'inches',
	  'foot': 'feet',
	  'us': 'us',
	  'kelvin': 'kelvin',
	  'celsius': 'celsius',
	  'fahrenheit': 'fahrenheit',
	  'gas': 'gas'
	};
	// 'person': 'people',
	// 'child': 'children',
	var singularMap = invert(pluralMap);
	
	function singularize(word) {
	  var plural = word.toLowerCase().trim();
	
	  if (singularMap[plural]) {
	    return singularMap[plural];
	  } else if (last(plural) === 's') {
	    return init(plural);
	  }
	  return plural;
	}
	
	function pluralize(word) {
	  var singular = word.trim();
	  return pluralMap[singular] || singular + 's';
	}
	
	/*
	These functions are all in the locale 'en'. If we add more locales, we'll have to refactor this.
	*/
	
	var getNumberFormat = always('\\d+(?:\\.\\d+)?');
	exports.getNumberFormat = getNumberFormat;
	var parseNumber = function parseNumber(context, value) {
	  return Number(value.replace(',', ''));
	};
	exports.parseNumber = parseNumber;
	var getFormattingHints = merge({ hints: [] });
	exports.getFormattingHints = getFormattingHints;
	var preprocessTags = identity;
	exports.preprocessTags = preprocessTags;
	
	function getSiUnit(context, name) {
	  return _dataEnvironmentSi2['default'][name] || name;
	}
	
	function getUnitValue(context, name) {
	  // FIXME: Check context
	  return _dataEnvironmentUnits2['default'][name];
	}
	
	function getUnit(context, unit) {
	  // FIXME: Call it getUnitName
	  if (unit === 's') {
	    return 'second';
	  }
	
	  var singularUnit = singularize(unit);
	  var abbreviation = _dataEnAbbreviations2['default'][singularUnit];
	
	  if (abbreviation) {
	    return abbreviation;
	  } else if (_dataEnvironmentUnits2['default'][singularUnit]) {
	    return singularUnit;
	  }
	  return null;
	}
	
	var getConstant = always(null);exports.getConstant = getConstant;
	// FIXME
	
	// FIXME: This is all shitty. types/entity should call back into locale to do special formatting, such as currency, and also regular formatting, such as adding a unit
	var isSpecialUnit = pipe(head, equals('_'));
	function formatEntityNumber(entity) {
	  if (entity.value === 1 && !pipe(keys, isEmpty)(entity.symbols)) {
	    return '';
	  } /*else if (entity.formattingHints.base) {
	    return entity.value.toString(entity.formattingHints.base);
	    }*/
	
	  var absValue = Math.abs(entity.value);
	
	  /*if (dimensions(entity).currency === 1) {
	    return entity.value.toFixed(2);
	  } else */if (absValue > 1E2 || absValue === 0) {
	    return entity.value.toFixed(0);
	  } else if (absValue > 1E-6) {
	    // Note bigger than zero, so no log 0
	    var orderOfMagnitude = Math.floor(Math.log10(absValue));
	    var magnitude = Math.pow(10, orderOfMagnitude);
	
	    if (absValue - Math.floor(absValue) < magnitude * 1E-3) {
	      return entity.value.toFixed(0);
	    }
	    return entity.value.toFixed(2 - orderOfMagnitude);
	  }
	  return entity.value.toExponential(3);
	}
	function powerString(value) {
	  if (Number(value) !== 1) {
	    return reduce(function (out, superscript, value) {
	      return out.replace(new RegExp(value, 'g'), superscript);
	    }, String(value), powerString.superscripts).replace('.', ' ').replace('-', '⁻');
	  }
	  return '';
	}
	powerString.superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
	function formatEntityUnits(entity, str) {
	  return reduce(function (out, _ref) {
	    var unit = _ref[0];
	    var value = _ref[1];
	
	    if (isSpecialUnit(unit)) {
	      return out;
	    } else if (value === 1 && _dataEnUnitFormatting2['default'].hasOwnProperty(unit)) {
	      var specialUnit = _dataEnUnitFormatting2['default'][unit];
	
	      if (specialUnit.prefix) {
	        return specialUnit.prefix + out;
	      } else if (specialUnit.suffix) {
	        return out + specialUnit.suffix;
	      }
	    } else {
	      var unitPlural = unit;
	
	      if (value >= 1 && entity.value !== 1) {
	        unitPlural = pluralize(unit);
	      }
	
	      return out + ' ' + (value < 0 ? 'per ' : '') + unitPlural + powerString(Math.abs(value));
	    }
	  }, str, toPairs(entity.units));
	}
	
	function entityToString(entity) {
	  return pipe(formatEntityNumber, partial(formatEntityUnits, entity))(entity);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(76), __webpack_require__(77), __webpack_require__(78), __webpack_require__(53), __webpack_require__(79), __webpack_require__(24), __webpack_require__(27), __webpack_require__(65), __webpack_require__(41), __webpack_require__(45), __webpack_require__(80), __webpack_require__(31), __webpack_require__(49), __webpack_require__(81)))

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _has = __webpack_require__(43);
	var keys = __webpack_require__(45);
	
	
	/**
	 * Same as R.invertObj, however this accounts for objects
	 * with duplicate values by putting the values into an
	 * array.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig {s: x} -> {x: [ s, ... ]}
	 * @param {Object} obj The object or array to invert
	 * @return {Object} out A new object with keys
	 * in an array.
	 * @example
	 *
	 *      var raceResultsByFirstName = {
	 *        first: 'alice',
	 *        second: 'jake',
	 *        third: 'alice',
	 *      };
	 *      R.invert(raceResultsByFirstName);
	 *      //=> { 'alice': ['first', 'third'], 'jake':['second'] }
	 */
	module.exports = _curry1(function invert(obj) {
	  var props = keys(obj);
	  var len = props.length;
	  var idx = 0;
	  var out = {};
	
	  while (idx < len) {
	    var key = props[idx];
	    var val = obj[key];
	    var list = _has(val, out) ? out[val] : (out[val] = []);
	    list[list.length] = key;
	    idx += 1;
	  }
	  return out;
	});


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var nth = __webpack_require__(66);
	
	
	/**
	 * Returns the last element of the given list or string.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @see R.init, R.head, R.tail
	 * @sig [a] -> a | Undefined
	 * @sig String -> String
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
	 *      R.last([]); //=> undefined
	 *
	 *      R.last('abc'); //=> 'c'
	 *      R.last(''); //=> ''
	 */
	module.exports = nth(-1);


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var slice = __webpack_require__(34);
	
	
	/**
	 * Returns all but the last element of the given list or string.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @see R.last, R.head, R.tail
	 * @sig [a] -> [a]
	 * @sig String -> String
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      R.init([1, 2, 3]);  //=> [1, 2]
	 *      R.init([1, 2]);     //=> [1]
	 *      R.init([1]);        //=> []
	 *      R.init([]);         //=> []
	 *
	 *      R.init('abc');  //=> 'ab'
	 *      R.init('ab');   //=> 'a'
	 *      R.init('a');    //=> ''
	 *      R.init('');     //=> ''
	 */
	module.exports = slice(0, -1);


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var keys = __webpack_require__(45);
	
	
	/**
	 * Create a new object with the own properties of `a`
	 * merged with the own properties of object `b`.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig {k: v} -> {k: v} -> {k: v}
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object}
	 * @example
	 *
	 *      R.merge({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
	 *      //=> { 'name': 'fred', 'age': 40 }
	 *
	 *      var resetToDefault = R.merge(R.__, {x: 0});
	 *      resetToDefault({x: 5, y: 2}); //=> {x: 0, y: 2}
	 */
	module.exports = _curry2(function merge(a, b) {
	  var result = {};
	  var ks = keys(a);
	  var idx = 0;
	  while (idx < ks.length) {
	    result[ks[idx]] = a[ks[idx]];
	    idx += 1;
	  }
	  ks = keys(b);
	  idx = 0;
	  while (idx < ks.length) {
	    result[ks[idx]] = b[ks[idx]];
	    idx += 1;
	  }
	  return result;
	});


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	
	
	/**
	 * Reports whether the list has zero elements.
	 *
	 * @func
	 * @memberOf R
	 * @category Logic
	 * @sig [a] -> Boolean
	 * @param {Array} list
	 * @return {Boolean}
	 * @example
	 *
	 *      R.isEmpty([1, 2, 3]);   //=> false
	 *      R.isEmpty([]);          //=> true
	 *      R.isEmpty('');          //=> true
	 *      R.isEmpty(null);        //=> false
	 *      R.isEmpty(R.keys({}));  //=> true
	 *      R.isEmpty({});          //=> false ({} does not have a length property)
	 *      R.isEmpty({length: 0}); //=> true
	 */
	module.exports = _curry1(function isEmpty(list) {
	  return Object(list).length === 0;
	});


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(14);
	var _createPartialApplicator = __webpack_require__(82);
	var curry = __webpack_require__(54);
	
	
	/**
	 * Accepts as its arguments a function and any number of values and returns a function that,
	 * when invoked, calls the original function with all of the values prepended to the
	 * original function's arguments list. In some libraries this function is named `applyLeft`.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig (a -> b -> ... -> i -> j -> ... -> m -> n) -> a -> b-> ... -> i -> (j -> ... -> m -> n)
	 * @param {Function} fn The function to invoke.
	 * @param {...*} [args] Arguments to prepend to `fn` when the returned function is invoked.
	 * @return {Function} A new function wrapping `fn`. When invoked, it will call `fn`
	 *         with `args` prepended to `fn`'s arguments list.
	 * @example
	 *
	 *      var multiply = function(a, b) { return a * b; };
	 *      var double = R.partial(multiply, 2);
	 *      double(2); //=> 4
	 *
	 *      var greet = function(salutation, title, firstName, lastName) {
	 *        return salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
	 *      };
	 *      var sayHello = R.partial(greet, 'Hello');
	 *      var sayHelloToMs = R.partial(sayHello, 'Ms.');
	 *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
	 */
	module.exports = curry(_createPartialApplicator(_concat));


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var _arity = __webpack_require__(10);
	var _slice = __webpack_require__(19);
	
	
	module.exports = function _createPartialApplicator(concat) {
	  return function(fn) {
	    var args = _slice(arguments, 1);
	    return _arity(Math.max(0, fn.length - args.length), function() {
	      return fn.apply(this, concat(args, arguments));
	    });
	  };
	};


/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = {
		"_rgb": {
			"type": "_colour",
			"base": 1
		},
		"_hsl": {
			"type": "_colour",
			"base": 1
		},
		"_date": {
			"type": "_date",
			"base": 1
		},
		"second": {
			"type": "time",
			"base": 1
		},
		"minute": {
			"type": "time",
			"base": 60
		},
		"hour": {
			"type": "time",
			"base": 3600
		},
		"day": {
			"type": "time",
			"base": 86400
		},
		"weekday": {
			"type": "time",
			"base": 120960
		},
		"week": {
			"type": "time",
			"base": 604800
		},
		"fortnight": {
			"type": "time",
			"base": 1209600
		},
		"month": {
			"type": "time",
			"base": 2628000
		},
		"year": {
			"type": "time",
			"base": 31536000
		},
		"decade": {
			"type": "time",
			"base": 315360000
		},
		"century": {
			"type": "time",
			"base": 3155673600
		},
		"meter": {
			"type": "length",
			"base": 1
		},
		"inch": {
			"type": "length",
			"base": 0.0254
		},
		"foot": {
			"type": "length",
			"base": 0.3048
		},
		"yard": {
			"type": "length",
			"base": 0.9144
		},
		"mile": {
			"type": "length",
			"base": 1609
		},
		"league": {
			"type": "length",
			"base": 4827
		},
		"fathom": {
			"type": "length",
			"base": 1.8288
		},
		"furlong": {
			"type": "length",
			"base": 201
		},
		"light year": {
			"type": "length",
			"base": 9460528400000000
		},
		"angstrom": {
			"type": "length",
			"base": 1e-10
		},
		"nautical mile": {
			"type": "length",
			"base": 1852
		},
		"gram": {
			"type": "weight",
			"base": 1
		},
		"tonne": {
			"type": "weight",
			"base": 1000000
		},
		"ounce": {
			"type": "weight",
			"base": 28.35
		},
		"pound": {
			"type": "weight",
			"base": 453.6
		},
		"stone": {
			"type": "weight",
			"base": 6350
		},
		"acre": {
			"type": "area",
			"base": 4047
		},
		"hectare": {
			"type": "area",
			"base": 10000
		},
		"liter": {
			"type": "volume",
			"base": 0.001
		},
		"gallon": {
			"type": "volume",
			"base": 0.00454609
		},
		"us gallon": {
			"type": "volume",
			"base": 0.003785
		},
		"quart": {
			"type": "volume",
			"base": 0.0009464
		},
		"cup": {
			"type": "volume",
			"base": 0.00024
		},
		"US cup": {
			"type": "volume",
			"base": 0.00023559
		},
		"teaspoon": {
			"type": "volume",
			"base": 0.000004929
		},
		"tablespoon": {
			"type": "volume",
			"base": 0.00001479
		},
		"drop": {
			"type": "volume",
			"base": 5e-8
		},
		"fluid ounce": {
			"type": "volume",
			"base": 0.000028413
		},
		"Joule": {
			"type": "energy",
			"base": 1
		},
		"Calorie": {
			"type": "energy",
			"base": 4.184
		},
		"electron volt": {
			"type": "energy",
			"base": 1.602e-19
		},
		"BTU": {
			"type": "energy",
			"base": 1055
		},
		"therm": {
			"type": "energy",
			"base": 1055000000
		},
		"Watt": {
			"type": "power",
			"base": 1
		},
		"bit": {
			"type": "memory",
			"base": 1
		},
		"byte": {
			"type": "memory",
			"base": 8
		},
		"percent": {
			"base": 0.01
		},
		"degree": {
			"base": 0.017453292519943295
		},
		"radian": {
			"base": 1
		},
		"arcminute": {
			"base": 0.0002908882086657216
		},
		"arcsecond": {
			"base": 0.00000484813681109536
		},
		"Kelvin": {
			"type": "temperature",
			"base": 1
		},
		"Celsius": {
			"type": "temperature",
			"forwardFn": "celsiusForwardFn",
			"backwardFn": "celsiusBackwardFn"
		},
		"Fahrenheit": {
			"type": "temperature",
			"forwardFn": "fahrenheitForwardFn",
			"backwardFn": "fahrenheitBackwardFn"
		},
		"gas mark": {
			"type": "temperature",
			"forwardFn": "gasmarkForwardFn",
			"backwardFn": "gasmarkBackwardFn"
		},
		"AUD": {
			"type": "currency",
			"base": 1
		},
		"BGN": {
			"type": "currency",
			"base": 1
		},
		"BRL": {
			"type": "currency",
			"base": 1
		},
		"CAD": {
			"type": "currency",
			"base": 1
		},
		"CHF": {
			"type": "currency",
			"base": 1
		},
		"CNY": {
			"type": "currency",
			"base": 1
		},
		"CZK": {
			"type": "currency",
			"base": 1
		},
		"DKK": {
			"type": "currency",
			"base": 1
		},
		"EUR": {
			"type": "currency",
			"base": 1
		},
		"GBP": {
			"type": "currency",
			"base": 1
		},
		"HKD": {
			"type": "currency",
			"base": 1
		},
		"HRK": {
			"type": "currency",
			"base": 1
		},
		"HUF": {
			"type": "currency",
			"base": 1
		},
		"IDR": {
			"type": "currency",
			"base": 1
		},
		"ILS": {
			"type": "currency",
			"base": 1
		},
		"INR": {
			"type": "currency",
			"base": 1
		},
		"JPY": {
			"type": "currency",
			"base": 1
		},
		"KRW": {
			"type": "currency",
			"base": 1
		},
		"MXN": {
			"type": "currency",
			"base": 1
		},
		"MYR": {
			"type": "currency",
			"base": 1
		},
		"NOK": {
			"type": "currency",
			"base": 1
		},
		"NZD": {
			"type": "currency",
			"base": 1
		},
		"PHP": {
			"type": "currency",
			"base": 1
		},
		"PLN": {
			"type": "currency",
			"base": 1
		},
		"RON": {
			"type": "currency",
			"base": 1
		},
		"RUB": {
			"type": "currency",
			"base": 1
		},
		"SEK": {
			"type": "currency",
			"base": 1
		},
		"SGD": {
			"type": "currency",
			"base": 1
		},
		"THB": {
			"type": "currency",
			"base": 1
		},
		"TRY": {
			"type": "currency",
			"base": 1
		},
		"USD": {
			"type": "currency",
			"base": 1
		},
		"ZAR": {
			"type": "currency",
			"base": 1
		},
		"femtosecond": {
			"type": "time",
			"base": 1e-15
		},
		"picosecond": {
			"type": "time",
			"base": 1e-12
		},
		"nanosecond": {
			"type": "time",
			"base": 1e-9
		},
		"microsecond": {
			"type": "time",
			"base": 0.000001
		},
		"millisecond": {
			"type": "time",
			"base": 0.001
		},
		"femtometer": {
			"type": "length",
			"base": 1e-15
		},
		"picometer": {
			"type": "length",
			"base": 1e-12
		},
		"nanometer": {
			"type": "length",
			"base": 1e-9
		},
		"micrometer": {
			"type": "length",
			"base": 0.000001
		},
		"millimeter": {
			"type": "length",
			"base": 0.001
		},
		"centimeter": {
			"type": "length",
			"base": 0.01
		},
		"kilometer": {
			"type": "length",
			"base": 1000
		},
		"megameter": {
			"type": "length",
			"base": 1000000
		},
		"gigameter": {
			"type": "length",
			"base": 1000000000
		},
		"terameter": {
			"type": "length",
			"base": 1000000000000
		},
		"petameter": {
			"type": "length",
			"base": 1000000000000000
		},
		"femtogram": {
			"type": "weight",
			"base": 1e-15
		},
		"picogram": {
			"type": "weight",
			"base": 1e-12
		},
		"nanogram": {
			"type": "weight",
			"base": 1e-9
		},
		"microgram": {
			"type": "weight",
			"base": 0.000001
		},
		"milligram": {
			"type": "weight",
			"base": 0.001
		},
		"kilogram": {
			"type": "weight",
			"base": 1000
		},
		"megagram": {
			"type": "weight",
			"base": 1000000
		},
		"gigagram": {
			"type": "weight",
			"base": 1000000000
		},
		"teragram": {
			"type": "weight",
			"base": 1000000000000
		},
		"petagram": {
			"type": "weight",
			"base": 1000000000000000
		},
		"milliliter": {
			"type": "volume",
			"base": 0.000001
		},
		"centiliter": {
			"type": "volume",
			"base": 0.00001
		},
		"femtojoule": {
			"type": "energy",
			"base": 1e-15
		},
		"picojoule": {
			"type": "energy",
			"base": 1e-12
		},
		"nanojoule": {
			"type": "energy",
			"base": 1e-9
		},
		"microjoule": {
			"type": "energy",
			"base": 0.000001
		},
		"millijoule": {
			"type": "energy",
			"base": 0.001
		},
		"centijoule": {
			"type": "energy",
			"base": 0.01
		},
		"kilojoule": {
			"type": "energy",
			"base": 1000
		},
		"megajoule": {
			"type": "energy",
			"base": 1000000
		},
		"gigajoule": {
			"type": "energy",
			"base": 1000000000
		},
		"terajoule": {
			"type": "energy",
			"base": 1000000000000
		},
		"petajoule": {
			"type": "energy",
			"base": 1000000000000000
		},
		"femtowatt": {
			"type": "power",
			"base": 1e-15
		},
		"picowatt": {
			"type": "power",
			"base": 1e-12
		},
		"nanowatt": {
			"type": "power",
			"base": 1e-9
		},
		"microwatt": {
			"type": "power",
			"base": 0.000001
		},
		"milliwatt": {
			"type": "power",
			"base": 1
		},
		"kilowatt": {
			"type": "power",
			"base": 1000
		},
		"megawatt": {
			"type": "power",
			"base": 1000000
		},
		"gigawatt": {
			"type": "power",
			"base": 1000000000
		},
		"terawatt": {
			"type": "power",
			"base": 1000000000000
		},
		"petawatt": {
			"type": "power",
			"base": 1000000000000000
		},
		"kilobit": {
			"type": "memory",
			"base": 1000
		},
		"megabit": {
			"type": "memory",
			"base": 1000000
		},
		"gigabit": {
			"type": "memory",
			"base": 1000000000
		},
		"terabit": {
			"type": "memory",
			"base": 1000000000000
		},
		"petabit": {
			"type": "memory",
			"base": 1000000000000000
		},
		"kibibit": {
			"type": "memory",
			"base": 1024
		},
		"mebibit": {
			"type": "memory",
			"base": 1048576
		},
		"gibibit": {
			"type": "memory",
			"base": 1073741824
		},
		"tebibit": {
			"type": "memory",
			"base": 1099511627776
		},
		"pebibit": {
			"type": "memory",
			"base": 1125899906842624
		},
		"kilobyte": {
			"type": "memory",
			"base": 8000
		},
		"megabyte": {
			"type": "memory",
			"base": 8000000
		},
		"gigabyte": {
			"type": "memory",
			"base": 8000000000
		},
		"terabyte": {
			"type": "memory",
			"base": 8000000000000
		},
		"petabyte": {
			"type": "memory",
			"base": 8000000000000000
		},
		"kibibyte": {
			"type": "memory",
			"base": 8192
		},
		"mebibyte": {
			"type": "memory",
			"base": 8388608
		},
		"gibibyte": {
			"type": "memory",
			"base": 8589934592
		},
		"tebibyte": {
			"type": "memory",
			"base": 8796093022208
		},
		"pebibyte": {
			"type": "memory",
			"base": 9007199254740992
		}
	}

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = {
		"time": "second",
		"length": "meter",
		"currency": "GBP",
		"weight": "gram",
		"temperature": "Celsius",
		"area": "acre",
		"volume": "liter",
		"energy": "Joule",
		"memory": "byte",
		"power": "Watt"
	}

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = {
		"ms": "millisecond",
		"s": "second",
		"min": "minute",
		"h": "hour",
		"hr": "hour",
		"d": "day",
		"dy": "day",
		"wk": "week",
		"yr": "year",
		"mm": "millimeter",
		"cm": "centimeter",
		"m": "meter",
		"km": "kilometer",
		"feet": "foot",
		"fermi": "femtometer",
		"mg": "milligram",
		"g": "gram",
		"kg": "kilogram",
		"kilo": "kilogram",
		"oz": "ounce",
		"lb": "pound",
		"ml": "milliliter",
		"tsp": "teaspoon",
		"tbsp": "tablespoon",
		"floz": "fluid ounce",
		"kb": "kilobyte",
		"mb": "megabyte",
		"gb": "gigabyte",
		"tb": "terabyte",
		"kib": "kibibyte",
		"mib": "mebibyte",
		"gib": "gibibyte",
		"tib": "tebibyte",
		"£": "GBP",
		"$": "USD",
		"€": "EUR",
		"euro": "EUR",
		"dollar": "USD",
		"sterling": "GBP",
		"baht": "THB",
		"forint": "HUF",
		"koruna": "CZK",
		"kuna": "HRK",
		"leu": "RON",
		"lev": "BGN",
		"lira": "TRY",
		"rand": "ZAR",
		"ringgit": "MYR",
		"ruble": "RUB",
		"rupee": "INR",
		"rupiah": "IDR",
		"shekel": "ILS",
		"sheqel": "ILS",
		"won": "KRW",
		"yen": "JPY",
		"yuan": "CNY",
		"zloty": "PLN",
		"j": "Joule",
		"cal": "Calorie",
		"ev": "electron volt",
		"centigrade": "Celsius",
		"deg": "degree",
		"rad": "radian",
		"%": "percent",
		"joule": "Joule",
		"calorie": "Calorie",
		"btu": "BTU",
		"watt": "Watt",
		"kelvin": "Kelvin",
		"celsius": "Celsius",
		"fahrenheit": "Fahrenheit",
		"aud": "AUD",
		"bgn": "BGN",
		"brl": "BRL",
		"cad": "CAD",
		"chf": "CHF",
		"cny": "CNY",
		"czk": "CZK",
		"dkk": "DKK",
		"eur": "EUR",
		"gbp": "GBP",
		"hkd": "HKD",
		"hrk": "HRK",
		"huf": "HUF",
		"idr": "IDR",
		"ils": "ILS",
		"inr": "INR",
		"jpy": "JPY",
		"krw": "KRW",
		"mxn": "MXN",
		"myr": "MYR",
		"nok": "NOK",
		"nzd": "NZD",
		"php": "PHP",
		"pln": "PLN",
		"ron": "RON",
		"rub": "RUB",
		"sek": "SEK",
		"sgd": "SGD",
		"thb": "THB",
		"try": "TRY",
		"usd": "USD",
		"zar": "ZAR",
		"metre": "meter",
		"femtometre": "femtometer",
		"picometre": "picometer",
		"nanometre": "nanometer",
		"micrometre": "micrometer",
		"millimetre": "millimeter",
		"centimetre": "centimeter",
		"kilometre": "kilometer",
		"megametre": "megameter",
		"gigametre": "gigameter",
		"terametre": "terameter",
		"petametre": "petameter",
		"litre": "liter",
		"millilitre": "milliliter",
		"centilitre": "centiliter",
		"rgb": "_rgb",
		"hsl": "_hsl"
	}

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = {
		"Kelvin": {
			"suffix": " Kelvin"
		},
		"Celsius": {
			"suffix": "℃"
		},
		"Fahrenheit": {
			"suffix": "℉"
		},
		"gas mark": {
			"prefix": "Gas mark "
		},
		"angstrom": {
			"suffix": " Å"
		},
		"GBP": {
			"prefix": "£"
		},
		"USD": {
			"prefix": "$"
		},
		"EUR": {
			"suffix": "€"
		},
		"percent": {
			"suffix": "%"
		},
		"degree": {
			"suffix": "°"
		},
		"arcsecond": {
			"suffix": "″"
		},
		"arcminute": {
			"suffix": "′"
		}
	}

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// when used in node, this will actually load the util module we depend on
	// versus loading the builtin util module as happens otherwise
	// this is a bug in node module loading as far as I am concerned
	var util = __webpack_require__(88);
	
	var pSlice = Array.prototype.slice;
	var hasOwn = Object.prototype.hasOwnProperty;
	
	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.
	
	var assert = module.exports = ok;
	
	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })
	
	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;
	
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  }
	  else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;
	
	      // try to strip useless frames
	      var fn_name = stackStartFunction.name;
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }
	
	      this.stack = out;
	    }
	  }
	};
	
	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);
	
	function replacer(key, value) {
	  if (util.isUndefined(value)) {
	    return '' + value;
	  }
	  if (util.isNumber(value) && !isFinite(value)) {
	    return value.toString();
	  }
	  if (util.isFunction(value) || util.isRegExp(value)) {
	    return value.toString();
	  }
	  return value;
	}
	
	function truncate(s, n) {
	  if (util.isString(s)) {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}
	
	function getMessage(self) {
	  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(JSON.stringify(self.expected, replacer), 128);
	}
	
	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.
	
	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.
	
	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}
	
	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;
	
	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.
	
	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;
	
	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);
	
	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};
	
	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);
	
	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};
	
	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);
	
	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};
	
	function _deepEqual(actual, expected) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	
	  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
	    if (actual.length != expected.length) return false;
	
	    for (var i = 0; i < actual.length; i++) {
	      if (actual[i] !== expected[i]) return false;
	    }
	
	    return true;
	
	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();
	
	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;
	
	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!util.isObject(actual) && !util.isObject(expected)) {
	    return actual == expected;
	
	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected);
	  }
	}
	
	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}
	
	function objEquiv(a, b) {
	  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b)) {
	    return a === b;
	  }
	  var aIsArgs = isArguments(a),
	      bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b);
	  }
	  var ka = objectKeys(a),
	      kb = objectKeys(b),
	      key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key])) return false;
	  }
	  return true;
	}
	
	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);
	
	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};
	
	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);
	
	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};
	
	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
	
	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};
	
	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }
	
	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  } else if (actual instanceof expected) {
	    return true;
	  } else if (expected.call({}, actual) === true) {
	    return true;
	  }
	
	  return false;
	}
	
	function _throws(shouldThrow, block, expected, message) {
	  var actual;
	
	  if (util.isString(expected)) {
	    message = expected;
	    expected = null;
	  }
	
	  try {
	    block();
	  } catch (e) {
	    actual = e;
	  }
	
	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');
	
	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }
	
	  if (!shouldThrow && expectedException(actual, expected)) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }
	
	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}
	
	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);
	
	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws.apply(this, [true].concat(pSlice.call(arguments)));
	};
	
	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/message) {
	  _throws.apply(this, [false].concat(pSlice.call(arguments)));
	};
	
	assert.ifError = function(err) { if (err) {throw err;}};
	
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(90);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(91);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(89)))

/***/ },
/* 89 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 91 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(over, lens, identity, assoc) {'use strict';
	
	exports.__esModule = true;
	
	var _locale = __webpack_require__(75);
	
	var regexpToArray = function regexpToArray(exp, text) {
	  var regexp = new RegExp(exp, 'g');
	  var result = undefined;
	  var tags = [];
	  var i = 0;
	
	  while ((result = regexp.exec(text)) !== null) {
	    // eslint-disable-line
	    result.start = result.index;
	    result.end = result.index + result[0].length;
	    tags[i++] = result;
	  }
	
	  return tags;
	};
	
	var parseText = over(lens(identity, assoc('tags')), function (_ref) {
	  var locale = _ref.locale;
	  var text = _ref.text;
	
	  var numberFormat = _locale.getNumberFormat(locale);
	  var lowerText = text.toLowerCase();
	  // Refer to ./preprocessTags for the capture groups
	  var rawTags = regexpToArray('(?:(\\()|(\\))|(log2|log10|[\\£\\$\\€\\%]|[a-z]+)(?:\\^(\\d+))?|(0x[0-9a-f]+(?:\\.[0-9a-f]+)?|0o[0-7]+(?:.[0-7]+)?|0b[01]+(?:\\.[01]+)?|' + numberFormat + ')|(#[0-9a-f]{3}(?:[0-9a-f]{5}|[0-9a-f]{3}|[0-9a-f])?)|(\\*\\*|[=+\\-*\\/^])|(,))', lowerText);
	
	  return rawTags;
	});
	exports['default'] = parseText;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(62), __webpack_require__(63), __webpack_require__(24), __webpack_require__(64)))

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(pipe, zip, filter, head, curry, over, lensProp, reject, isNil, lens, identity, assoc, map) {'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _locale = __webpack_require__(75);
	
	var locale = _interopRequireWildcard(_locale);
	
	var _util = __webpack_require__(96);
	
	var statementParts = [null, // full text
	'TAG_OPEN_BRACKET', 'TAG_CLOSE_BRACKET', 'TEXT_SYMBOL_UNIT', null, // symbol-unit exponent
	'TEXT_NUMBER', 'TEXT_COLOR', 'TEXT_OPERATOR', 'TAG_COMMA'];
	
	var operators = {
	  '+': 'ADD',
	  '-': 'SUBTRACT',
	  '*': 'MULTIPLY',
	  '/': 'DIVIDE',
	  '**': 'EXPONENT',
	  '^': 'EXPONENT',
	  '=': 'EQUATE'
	};
	
	var processTagElement = {
	  TEXT_SYMBOL_UNIT: function TEXT_SYMBOL_UNIT(context, tag) {
	    var value = tag.value;
	    var start = tag.start;
	    var end = tag.end;
	
	    var canNoop = false;
	    var options = [];
	
	    var power = Number(tag[4] || 1);
	
	    // if (functions.hasOwnProperty(value)) {
	    //   options.push({
	    //     ...out,
	    //     type: 'TAG_FUNCTION',
	    //     value,
	    //     power,
	    //   });
	    // }
	
	    // if (power === 1) {
	    //   const colour = colorForge.css(value);
	    //
	    //   if (colour !== null) {
	    //     options.push({
	    //       ...out,
	    //       type: 'TAG_COLOR',
	    //       value: colour,
	    //     });
	    //   }
	    // }
	
	    var unit = locale.getUnit(context, value);
	
	    if (unit !== null) {
	      options.push(_extends({}, tag, {
	        type: 'TAG_UNIT',
	        value: unit,
	        power: power
	      }));
	    }
	
	    if (options.length === 0) {
	      // Why is this above getting constants?
	      // If we move this below, it makes the code easier
	      // Maybe it's in the flow that you define a constant, x = 3, then when you try to redefine it, it might fail?
	      // But shouldn't the = operator return null if that was the case?
	      options.push(_extends({}, tag, {
	        type: 'TAG_SYMBOL',
	        value: value,
	        power: power
	      }));
	      // TODO: If more than one symbol can be solved, make xy and xy^2 work
	      canNoop = true;
	    }
	
	    var constant = context.constants[value];
	    if (constant) {
	      options.push(_extends({}, tag, {
	        type: 'ENTITY',
	        value: constant.exponent(power)
	      }));
	    }
	
	    if (canNoop) {
	      options.push(_extends({}, tag, {
	        type: 'NOOP'
	      }));
	    }
	
	    if (options.length > 1) {
	      return {
	        type: 'PARSE_OPTIONS',
	        value: options
	      };
	    } else if (options.length === 1) {
	      return options[0];
	    }
	
	    return {
	      type: 'NOOP',
	      start: start,
	      end: end
	    };
	  },
	  // TEXT_COLOR(tag) {
	  //   return {
	  //     ...tag,
	  //     type: 'TAG_COLOR',
	  //     value: colorForce.hex(value);
	  //   }
	  // }
	  TEXT_OPERATOR: function TEXT_OPERATOR(context, tag) {
	    return _extends({}, tag, {
	      type: 'TAG_OPERATOR',
	      value: operators[tag.value]
	    });
	  },
	  TEXT_NUMBER: function TEXT_NUMBER(context, tag) {
	    return _extends({}, tag, {
	      type: 'TAG_NUMBER',
	      value: locale.parseNumber(context, tag.value)
	    });
	  },
	  'default': function _default(context, tag) {
	    return tag;
	  }
	};
	
	var findValueAndType = pipe(zip(statementParts), filter(function (_ref) {
	  var type = _ref[0];
	  var tag = _ref[1];
	  return type !== null && tag !== undefined;
	}), head);
	
	var processTag = curry(function (context, tag) {
	  if (tag.type) {
	    return tag;
	  }
	
	  var _findValueAndType = findValueAndType(tag);
	
	  var type = _findValueAndType[0];
	  var value = _findValueAndType[1];
	  var start = tag.start;
	  var end = tag.end;
	
	  var newTag = { start: start, end: end, value: value, type: type };
	
	  return (processTagElement[type] || processTagElement['default'])(context, newTag);
	});
	
	function resolveTagBracket(bracketLevel, tag) {
	  if (tag.type === 'TAG_OPEN_BRACKET') {
	    return [bracketLevel + 1, _extends({}, tag, { value: bracketLevel })];
	  } else if (tag.type === 'TAG_CLOSE_BRACKET') {
	    return [bracketLevel - 1, _extends({}, tag, { value: bracketLevel - 1 })];
	  }
	  return [bracketLevel, tag];
	}
	
	var preprocessTags = pipe(locale.preprocessTags, over(lensProp('tags'), reject(isNil)), over(lens(identity, assoc('tags')), function (context) {
	  return map(processTag(context), context.tags);
	}), over(lensProp('tags'), _util.mapWithAccum(resolveTagBracket, 0)));
	exports['default'] = preprocessTags;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27), __webpack_require__(94), __webpack_require__(57), __webpack_require__(65), __webpack_require__(54), __webpack_require__(62), __webpack_require__(95), __webpack_require__(55), __webpack_require__(60), __webpack_require__(63), __webpack_require__(24), __webpack_require__(64), __webpack_require__(16)))

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Creates a new list out of the two supplied by pairing up
	 * equally-positioned items from both lists.  The returned list is
	 * truncated to the length of the shorter of the two input lists.
	 * Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig [a] -> [b] -> [[a,b]]
	 * @param {Array} list1 The first array to consider.
	 * @param {Array} list2 The second array to consider.
	 * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
	 * @example
	 *
	 *      R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
	 */
	module.exports = _curry2(function zip(a, b) {
	  var rv = [];
	  var idx = 0;
	  var len = Math.min(a.length, b.length);
	  while (idx < len) {
	    rv[idx] = [a[idx], b[idx]];
	    idx += 1;
	  }
	  return rv;
	});


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var assoc = __webpack_require__(64);
	var lens = __webpack_require__(63);
	var prop = __webpack_require__(36);
	
	
	/**
	 * Returns a lens whose focus is the specified property.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @typedef Lens s a = Functor f => (a -> f a) -> s -> f s
	 * @sig String -> Lens s a
	 * @param {String} k
	 * @return {Lens}
	 * @see R.view, R.set, R.over
	 * @example
	 *
	 *      var xLens = R.lensProp('x');
	 *
	 *      R.view(xLens, {x: 1, y: 2});            //=> 1
	 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
	 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
	 */
	module.exports = _curry1(function lensProp(k) {
	  return lens(prop(k), assoc(k));
	});


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(pipe, mapAccum, last, mapAccumRight, reject, isNil, length, equals, complement) {// import { pipe, equals, mapAccum, mapAccumRight, isNil, last, reject, length } from 'ramda';
	
	"use strict";
	
	exports.__esModule = true;
	var mapWithAccum = pipe(mapAccum, last);
	exports.mapWithAccum = mapWithAccum;
	var mapWithAccumRight = pipe(mapAccumRight, last);
	exports.mapWithAccumRight = mapWithAccumRight;
	var rejectNil = reject(isNil);
	exports.rejectNil = rejectNil;
	var lengthIsOne = pipe(length, equals(1));
	exports.lengthIsOne = lengthIsOne;
	var notNil = complement(isNil);
	exports.notNil = notNil;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27), __webpack_require__(97), __webpack_require__(77), __webpack_require__(98), __webpack_require__(55), __webpack_require__(60), __webpack_require__(99), __webpack_require__(41), __webpack_require__(101)))

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	
	
	/**
	 * The mapAccum function behaves like a combination of map and reduce; it applies a
	 * function to each element of a list, passing an accumulating parameter from left to
	 * right, and returning a final value of this accumulator together with the new list.
	 *
	 * The iterator function receives two arguments, *acc* and *value*, and should return
	 * a tuple *[acc, value]*.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y])
	 * @param {Function} fn The function to be called on every element of the input `list`.
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @example
	 *
	 *      var digits = ['1', '2', '3', '4'];
	 *      var append = function(a, b) {
	 *        return [a + b, a + b];
	 *      }
	 *
	 *      R.mapAccum(append, 0, digits); //=> ['01234', ['01', '012', '0123', '01234']]
	 */
	module.exports = _curry3(function mapAccum(fn, acc, list) {
	  var idx = 0, len = list.length, result = [], tuple = [acc];
	  while (idx < len) {
	    tuple = fn(tuple[0], list[idx]);
	    result[idx] = tuple[1];
	    idx += 1;
	  }
	  return [tuple[0], result];
	});


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	
	
	/**
	 * The mapAccumRight function behaves like a combination of map and reduce; it applies a
	 * function to each element of a list, passing an accumulating parameter from right
	 * to left, and returning a final value of this accumulator together with the new list.
	 *
	 * Similar to `mapAccum`, except moves through the input list from the right to the
	 * left.
	 *
	 * The iterator function receives two arguments, *acc* and *value*, and should return
	 * a tuple *[acc, value]*.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y])
	 * @param {Function} fn The function to be called on every element of the input `list`.
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @example
	 *
	 *      var digits = ['1', '2', '3', '4'];
	 *      var append = function(a, b) {
	 *        return [a + b, a + b];
	 *      }
	 *
	 *      R.mapAccumRight(append, 0, digits); //=> ['04321', ['04321', '0432', '043', '04']]
	 */
	module.exports = _curry3(function mapAccumRight(fn, acc, list) {
	  var idx = list.length - 1, result = [], tuple = [acc];
	  while (idx >= 0) {
	    tuple = fn(tuple[0], list[idx]);
	    result[idx] = tuple[1];
	    idx -= 1;
	  }
	  return [tuple[0], result];
	});


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var is = __webpack_require__(100);
	
	
	/**
	 * Returns the number of elements in the array by returning `list.length`.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig [a] -> Number
	 * @param {Array} list The array to inspect.
	 * @return {Number} The length of the array.
	 * @example
	 *
	 *      R.length([]); //=> 0
	 *      R.length([1, 2, 3]); //=> 3
	 */
	module.exports = _curry1(function length(list) {
	  return list != null && is(Number, list.length) ? list.length : NaN;
	});


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * See if an object (`val`) is an instance of the supplied constructor.
	 * This function will check up the inheritance chain, if any.
	 *
	 * @func
	 * @memberOf R
	 * @category Type
	 * @sig (* -> {*}) -> a -> Boolean
	 * @param {Object} ctor A constructor
	 * @param {*} val The value to test
	 * @return {Boolean}
	 * @example
	 *
	 *      R.is(Object, {}); //=> true
	 *      R.is(Number, 1); //=> true
	 *      R.is(Object, 1); //=> false
	 *      R.is(String, 's'); //=> true
	 *      R.is(String, new String('')); //=> true
	 *      R.is(Object, new String('')); //=> true
	 *      R.is(Object, 's'); //=> false
	 *      R.is(Number, {}); //=> false
	 */
	module.exports = _curry2(function is(Ctor, val) {
	  return val != null && val.constructor === Ctor || val instanceof Ctor;
	});


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var _complement = __webpack_require__(56);
	var _curry1 = __webpack_require__(5);
	
	
	/**
	 * Takes a function `f` and returns a function `g` such that:
	 *
	 *   - applying `g` to zero or more arguments will give __true__ if applying
	 *     the same arguments to `f` gives a logical __false__ value; and
	 *
	 *   - applying `g` to zero or more arguments will give __false__ if applying
	 *     the same arguments to `f` gives a logical __true__ value.
	 *
	 * @func
	 * @memberOf R
	 * @category Logic
	 * @sig (*... -> *) -> (*... -> Boolean)
	 * @param {Function} f
	 * @return {Function}
	 * @see R.not
	 * @example
	 *
	 *      var isEven = function(n) { return n % 2 === 0; };
	 *      var isOdd = R.complement(isEven);
	 *      isOdd(21); //=> true
	 *      isOdd(42); //=> false
	 */
	module.exports = _curry1(_complement);


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(pipe, curry, over, lensProp) {'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _utilsTagUtils = __webpack_require__(103);
	
	var _util = __webpack_require__(96);
	
	var tagUnitPowerReciprocal = {
	  type: 'TAG_UNIT_POWER_PREFIX',
	  value: -1
	};
	
	var tagNegate = {
	  type: 'TAG_OPERATOR',
	  value: 'NEGATE'
	};
	
	function fixNaturalNotationWithPrevious(previous, tag) {
	  var newTag = tag;
	
	  if (tag.value === 'SUBTRACT' && (!previous || previous.type === 'TAG_OPERATOR')) {
	    // Fix negative signs at start of input (-1 meters) and after operators (3 * -1 meters)
	    newTag = _extends({}, tag, tagNegate);
	  }
	
	  return [tag, newTag];
	}
	
	function fixNotationWithNext(next, tag) {
	  var newTag = tag;
	
	  if (tag.type === 'TAG_OPERATOR' && next && next.type === 'TAG_UNIT') {
	    if (tag.value === 'divide') {
	      // Fix using / as an alias for 'per' (1 meter / second)
	      newTag = _extends({}, tag, tagUnitPowerReciprocal);
	    } else if (tag.value === 'SUBTRACT') {
	      // Fix any prefixed unit with a negative sign (-€5)
	      newTag = _extends({}, tag, tagNegate);
	    }
	  }
	
	  return [tag, newTag];
	}
	
	// Can the two tag negatives be found by looking at all subtractions, and converting to a negative iff there are only unit tags between the subtract and the next number
	var fixNaturalMathNotation = pipe(_util.mapWithAccum(fixNaturalNotationWithPrevious, null), _util.mapWithAccumRight(fixNotationWithNext, null));
	
	var resolveUnitPowerType = curry(function (type, power, tag) {
	  if (tag.type === type) {
	    return [tag.value, null];
	  } else if (tag.type === 'TAG_UNIT') {
	    return [1, _extends({}, tag, { power: tag.power * power })];
	  }
	
	  return [1, tag];
	});
	
	var resolveUnitPowerPrefixes = pipe(_util.mapWithAccum(resolveUnitPowerType('TAG_UNIT_POWER_PREFIX'), 1), _util.rejectNil);
	
	var resolveUnitPowerSuffixes = pipe(_util.mapWithAccum(resolveUnitPowerType('TAG_UNIT_POWER_SUFFIX'), 1), _util.rejectNil);
	
	var resolveUnitPowers = pipe(
	// Resolve 3 meters squared, 3 square meters, 3 meters per second etc.
	// Also resolves 1 meter / second when used in after fixNaturalMathNotation
	resolveUnitPowerPrefixes, resolveUnitPowerSuffixes);
	
	var postprocessTags = over(lensProp('tags'), pipe(_utilsTagUtils.untailTags, fixNaturalMathNotation, resolveUnitPowers, _utilsTagUtils.trimNoop));
	exports['default'] = postprocessTags;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27), __webpack_require__(54), __webpack_require__(62), __webpack_require__(95)))

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(whereEq, reduce, pipe, dropWhile, dropLastWhile) {// import { reduce, compose, dropLastWhile, dropWhile } from 'ramda';
	
	'use strict';
	
	exports.__esModule = true;
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var isNoop = whereEq({ type: 'NOOP' });
	
	exports.isNoop = isNoop;
	var untailTags = reduce(function (out, tag) {
	  var tail = tag.tail;
	
	  var tagWithoutTail = _objectWithoutProperties(tag, ['tail']);
	
	  if (tail) {
	    if (isNoop(tag)) {
	      return out.concat(tagWithoutTail, tail);
	    }
	
	    return out.concat(tail);
	  }
	
	  return out.concat(tagWithoutTail);
	}, []);
	
	exports.untailTags = untailTags;
	var trimNoop = pipe(dropWhile(isNoop), dropLastWhile(isNoop));
	exports.trimNoop = trimNoop;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(40), __webpack_require__(31), __webpack_require__(27), __webpack_require__(104), __webpack_require__(106)))

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _slice = __webpack_require__(19);
	var _xdropWhile = __webpack_require__(105);
	
	
	/**
	 * Returns a new list containing the last `n` elements of a given list, passing each value
	 * to the supplied predicate function, skipping elements while the predicate function returns
	 * `true`. The predicate function is passed one argument: *(value)*.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 * @see R.transduce
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} fn The function called per iteration.
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} A new array.
	 * @see R.takeWhile
	 * @example
	 *
	 *      var lteTwo = function(x) {
	 *        return x <= 2;
	 *      };
	 *
	 *      R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]
	 */
	module.exports = _curry2(_dispatchable('dropWhile', _xdropWhile, function dropWhile(pred, list) {
	  var idx = 0, len = list.length;
	  while (idx < len && pred(list[idx])) {
	    idx += 1;
	  }
	  return _slice(list, idx);
	}));


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _xfBase = __webpack_require__(22);
	
	
	module.exports = (function() {
	  function XDropWhile(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }
	  XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
	  XDropWhile.prototype['@@transducer/result'] = _xfBase.result;
	  XDropWhile.prototype['@@transducer/step'] = function(result, input) {
	    if (this.f) {
	      if (this.f(input)) {
	        return result;
	      }
	      this.f = null;
	    }
	    return this.xf['@@transducer/step'](result, input);
	  };
	
	  return _curry2(function _xdropWhile(f, xf) { return new XDropWhile(f, xf); });
	})();


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _slice = __webpack_require__(19);
	
	/**
	 * Returns a new list containing all but last the`n` elements of a given list,
	 * passing each value from the right to the supplied predicate function, skipping
	 * elements while the predicate function returns `true`. The predicate function
	 * is passed one argument: (value)*.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} fn The function called per iteration.
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} A new array.
	 * @see R.takeLastWhile
	 * @example
	 *
	 *      var lteThree = function(x) {
	 *        return x <= 3;
	 *      };
	 *
	 *      R.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2]
	 */
	module.exports = _curry2(function dropLastWhile(pred, list) {
	  var idx = list.length - 1;
	  while (idx >= 0 && pred(list[idx])) {
	    idx -= 1;
	  }
	  return _slice(list, 0, idx + 1);
	});


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(last, adjust, assoc, append, evolve, over, lensProp, pipe, defaultTo, add, assocPath, flip, identity, keys, isEmpty, where, equals, isNil, complement, reduce, map, ifElse, reject, cond, always, head, T, __, whereEq, curry, any, drop, find, indexOf, propEq, findIndex, slice, length, dropLastWhile, props, of, fromPairs, partial, uniq, pluck, takeWhile, takeLastWhile, dropWhile, dropLast, lens, prop) {'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _constants = __webpack_require__(136);
	
	var _util = __webpack_require__(96);
	
	var _utilsTagUtils = __webpack_require__(103);
	
	var _typesDescriptors = __webpack_require__(140);
	
	var _typesEntity = __webpack_require__(141);
	
	var _assert = __webpack_require__(87);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var miscGroupBase = {
	  type: 'MISC_GROUP',
	  groups: null
	};
	
	var empty = {
	  type: 'EMPTY',
	  value: null
	};
	
	var tagResolvers = {
	  TAG_NUMBER: function TAG_NUMBER(values, _ref) {
	    var value = _ref.value;
	
	    _assert2['default'](typeof value === 'number');
	    var lastItem = last(values);
	
	    if (lastItem.type === 'ENTITY' && lastItem.value === null) {
	      return adjust(assoc('value', value), -1, values);
	    }
	
	    return append(_extends({}, _typesDescriptors.entity, { value: value }), values);
	  },
	  TAG_UNIT: function TAG_UNIT(values, _ref2) {
	    var value = _ref2.value;
	    var power = _ref2.power;
	
	    // This code is almost identical for symbols (s/unit/symbol/g)
	    var lastItem = last(values);
	
	    if (lastItem.type === 'ENTITY') {
	      return adjust(evolve({
	        units: over(lensProp(value), pipe(defaultTo(0), add(power)))
	      }), -1, values);
	    }
	
	    return append(assocPath(['units', value], power, _typesDescriptors.entity), values);
	  },
	  NOOP: append(_typesDescriptors.entity),
	  BRACKETS_GROUP: flip(append),
	  'default': identity
	};
	
	var objectIsEmpty = pipe(keys, isEmpty);
	
	var valueTypeIsEmpty = where({
	  type: equals('ENTITY'),
	  value: isNil,
	  units: objectIsEmpty,
	  symbols: objectIsEmpty
	});
	
	var valueTypeHasNilValueButHasSymbols = where({
	  type: equals('ENTITY'),
	  value: isNil,
	  symbols: complement(objectIsEmpty)
	});
	
	var resolveTagsWithoutOperations = pipe(reduce(function (values, tag) {
	  return (tagResolvers[tag.type] || tagResolvers['default'])(values, tag);
	}, [_typesDescriptors.entity]), map(ifElse(valueTypeHasNilValueButHasSymbols, assoc('value', 1), identity)), reject(valueTypeIsEmpty), cond([[isEmpty, always(empty)], [_util.lengthIsOne, head], [T, assoc('groups', __, miscGroupBase)]]));
	
	// Only wrap in value group iff groups.length > 1
	var groupOperations = reduce(function (operationGroup, tag) {
	  if (tag.type === 'TAG_OPERATOR' && operationGroup.level === _constants.orderOperations[tag.value]) {
	    return evolve({
	      operations: append(tag.value),
	      groups: append([])
	    }, operationGroup);
	  }
	
	  return evolve({
	    groups: adjust(append(tag), -1)
	  }, operationGroup);
	});
	
	var tagOperatorMatchesValue = pipe(assoc('value', __, { type: 'TAG_OPERATOR' }), whereEq);
	
	var resolveOperations = curry(function (startLevel, tags) {
	  var tagsContainOperation = pipe(tagOperatorMatchesValue, any(__, tags));
	
	  var operations = pipe(drop(startLevel), find(any(tagsContainOperation)))(_constants.operationsOrder);
	
	  if (!operations) {
	    return resolveTagsWithoutOperations(tags);
	  }
	
	  var level = indexOf(operations, _constants.operationsOrder);
	
	  return pipe(groupOperations({
	    type: 'OPERATIONS_GROUP',
	    groups: [[]],
	    operations: [],
	    level: level
	  }), evolve({ groups: map(resolveOperations(level + 1)) }))(tags);
	});
	
	var splitTags = reduce(function (tags, tag) {
	  if (tag.type === 'TAG_COMMA') {
	    return append([tag], tags);
	  }
	  return adjust(append(tag), -1, tags);
	}, [[]]);
	
	var resolveTagsWithoutBrackets = pipe(splitTags, map(resolveOperations(0)));
	
	var isOpenBracket = propEq('type', 'TAG_OPEN_BRACKET');
	
	function resolveBrackets(tags) {
	  var resolvedTags = tags;
	  var openBracketIndex = findIndex(isOpenBracket, tags);
	
	  if (openBracketIndex !== -1) {
	    var openBracket = tags[openBracketIndex];
	
	    var matchingCloseBracket = whereEq({
	      type: 'TAG_CLOSE_BRACKET',
	      value: openBracket.value
	    });
	    var closeBracketIndex = findIndex(matchingCloseBracket, tags);
	
	    if (closeBracketIndex === -1) {
	      closeBracketIndex = Infinity;
	    }
	
	    var tagsBefore = slice(0, openBracketIndex, tags);
	    var tagsInBracket = slice(openBracketIndex + 1, closeBracketIndex, tags);
	    var tagsAfter = slice(closeBracketIndex + 1, Infinity, tags);
	
	    var bracketGroup = {
	      type: 'BRACKETS_GROUP',
	      groups: resolveBrackets(tagsInBracket)
	    };
	
	    resolvedTags = [].concat(tagsBefore, [bracketGroup], tagsAfter);
	  }
	
	  return resolveTagsWithoutBrackets(resolvedTags);
	}
	
	var createASTFromTags = pipe(resolveBrackets, ifElse(pipe(length, equals(1)), head, always(null)));
	
	var conversionStatements = [{ type: 'NOOP' }, { type: 'TAG_UNIT' }, { type: 'TAG_UNIT_POWER_PREFIX' }, { type: 'TAG_UNIT_POWER_SUFFIX' }, { type: 'TAG_OPERATOR', value: 'NEGATE' }, { type: 'TAG_COMMA' }];
	var isConversionStatement = function isConversionStatement(tag) {
	  return any(whereEq(__, tag), conversionStatements);
	};
	var isNoop = whereEq({ type: 'NOOP' }); // FIXME: it's in tagutils
	var notNoop = complement(isNoop);
	var isComma = whereEq({ type: 'TAG_COMMA' });
	var dropLastNonNoop = dropLastWhile(notNoop);
	var getNooplessTags = pipe(reject(isNoop), reject(isComma));
	
	var addConversionToContext = function addConversionToContext(context, conversionTagsWithNoop, tags) {
	  var nooplessTags = getNooplessTags(tags);
	
	  if (length(nooplessTags) === 0) {
	    return context;
	  }
	
	  // Can this all just be done with resolveTagsWithoutOperations?
	  var conversionTags = _utilsTagUtils.trimNoop(conversionTagsWithNoop);
	
	  var conversionEntities = pipe(map(pipe(props(['value', 'power']), of, fromPairs)), map(assoc('units', __, _typesDescriptors.entity)))(conversionTags);
	  var allEqualDimensions = pipe(map(partial(_typesEntity.baseDimensions, context)), uniq, length, equals(1))(conversionEntities);
	
	  if (!allEqualDimensions) {
	    var conversion = pluck('units', conversionEntities);
	    return _extends({}, context, { tags: tags, conversion: conversion });
	  }
	
	  var conversionEntity = resolveTagsWithoutOperations(conversionTags);
	
	  if (conversionEntity.type === 'ENTITY') {
	    var conversion = conversionEntity.units;
	    return _extends({}, context, { tags: tags, conversion: conversion });
	  }
	
	  return context;
	};
	
	var findLeftConversion = function findLeftConversion(context) {
	  if (context.conversion) {
	    return context;
	  }
	
	  var conversionTags = pipe(takeWhile(isConversionStatement), dropLastNonNoop)(context.tags);
	  var remainingTags = drop(length(conversionTags), context.tags);
	
	  if (isEmpty(remainingTags) || last(remainingTags).type !== 'NOOP') {
	    return context;
	  }
	
	  return addConversionToContext(context, conversionTags, remainingTags);
	};
	
	var findRightConversion = function findRightConversion(context) {
	  if (context.conversion) {
	    return context;
	  }
	
	  var conversionTags = takeLastWhile(isConversionStatement, context.tags);
	
	  var precedingTag = context.tags[length(context.tags) - length(conversionTags) - 1];
	
	  if (precedingTag && (precedingTag.type === 'TAG_NUMBER' || precedingTag.type === 'DATE_TIME')) {
	    // Gathered too many tags and went into tags that would form an entity, drop some tags
	    conversionTags = dropWhile(notNoop, conversionTags);
	  }
	
	  if (length(conversionTags) === 0) {
	    return context;
	  }
	
	  var remainingTags = dropLast(length(conversionTags), context.tags);
	  return addConversionToContext(context, conversionTags, remainingTags);
	};
	
	var resolveTags = pipe(findLeftConversion, findRightConversion, over(lens(prop('tags'), assoc('ast')), createASTFromTags));
	exports['default'] = resolveTags;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(77), __webpack_require__(52), __webpack_require__(64), __webpack_require__(23), __webpack_require__(108), __webpack_require__(62), __webpack_require__(95), __webpack_require__(27), __webpack_require__(109), __webpack_require__(38), __webpack_require__(110), __webpack_require__(111), __webpack_require__(24), __webpack_require__(45), __webpack_require__(80), __webpack_require__(48), __webpack_require__(41), __webpack_require__(60), __webpack_require__(101), __webpack_require__(31), __webpack_require__(16), __webpack_require__(112), __webpack_require__(55), __webpack_require__(113), __webpack_require__(53), __webpack_require__(65), __webpack_require__(114), __webpack_require__(115), __webpack_require__(40), __webpack_require__(54), __webpack_require__(72), __webpack_require__(116), __webpack_require__(118), __webpack_require__(120), __webpack_require__(122), __webpack_require__(123), __webpack_require__(34), __webpack_require__(99), __webpack_require__(106), __webpack_require__(125), __webpack_require__(26), __webpack_require__(126), __webpack_require__(81), __webpack_require__(127), __webpack_require__(35), __webpack_require__(130), __webpack_require__(132), __webpack_require__(104), __webpack_require__(133), __webpack_require__(63), __webpack_require__(36)))

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(evolve) {var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Creates a new object by recursively evolving a shallow copy of `object`, according to the
	 * `transformation` functions. All non-primitive properties are copied by reference.
	 *
	 * A `tranformation` function will not be invoked if its corresponding key does not exist in
	 * the evolved object.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig {k: (v -> v)} -> {k: v} -> {k: v}
	 * @param {Object} transformations The object specifying transformation functions to apply
	 *        to the object.
	 * @param {Object} object The object to be transformed.
	 * @return {Object} The transformed object.
	 * @example
	 *
	 *      var tomato  = {firstName: '  Tomato ', data: {elapsed: 100, remaining: 1400}, id:123};
	 *      var transformations = {
	 *        firstName: R.trim,
	 *        lastName: R.trim, // Will not get invoked.
	 *        data: {elapsed: R.add(1), remaining: R.add(-1)}
	 *      };
	 *      R.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}
	 */
	module.exports = _curry2(function evolve(transformations, object) {
	  var transformation, key, type, result = {};
	  for (key in object) {
	    transformation = transformations[key];
	    type = typeof transformation;
	    result[key] = type === 'function' ? transformation(object[key])
	                : type === 'object'   ? evolve(transformations[key], object[key])
	                                      : object[key];
	  }
	  return result;
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(108)))

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Returns the second argument if it is not null or undefined. If it is null
	 * or undefined, the first (default) argument is returned.
	 *
	 * @func
	 * @memberOf R
	 * @category Logic
	 * @sig a -> b -> a | b
	 * @param {a} val The default value.
	 * @param {b} val The value to return if it is not null or undefined
	 * @return {*} The the second value or the default value
	 * @example
	 *
	 *      var defaultTo42 = defaultTo(42);
	 *
	 *      defaultTo42(null);  //=> 42
	 *      defaultTo42(undefined);  //=> 42
	 *      defaultTo42('Ramda');  //=> 'Ramda'
	 */
	module.exports = _curry2(function defaultTo(d, v) {
	  return v == null ? d : v;
	});


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(assocPath) {var _curry3 = __webpack_require__(4);
	var _slice = __webpack_require__(19);
	var assoc = __webpack_require__(64);
	
	
	/**
	 * Makes a shallow clone of an object, setting or overriding the nodes
	 * required to create the given path, and placing the specific value at the
	 * tail end of that path.  Note that this copies and flattens prototype
	 * properties onto the new object as well.  All non-primitive properties
	 * are copied by reference.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig [String] -> a -> {k: v} -> {k: v}
	 * @param {Array} path the path to set
	 * @param {*} val the new value
	 * @param {Object} obj the object to clone
	 * @return {Object} a new object similar to the original except along the specified path.
	 * @see R.dissocPath
	 * @example
	 *
	 *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
	 */
	module.exports = _curry3(function assocPath(path, val, obj) {
	  switch (path.length) {
	    case 0:
	      return obj;
	    case 1:
	      return assoc(path[0], val, obj);
	    default:
	      return assoc(path[0], assocPath(_slice(path, 1), val, Object(obj[path[0]])), obj);
	  }
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(110)))

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _slice = __webpack_require__(19);
	var curry = __webpack_require__(54);
	
	
	/**
	 * Returns a new function much like the supplied one, except that the first two arguments'
	 * order is reversed.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig (a -> b -> c -> ... -> z) -> (b -> a -> c -> ... -> z)
	 * @param {Function} fn The function to invoke with its first two parameters reversed.
	 * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
	 * @example
	 *
	 *      var mergeThree = function(a, b, c) {
	 *        return ([]).concat(a, b, c);
	 *      };
	 *
	 *      mergeThree(1, 2, 3); //=> [1, 2, 3]
	 *
	 *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
	 */
	module.exports = _curry1(function flip(fn) {
	  return curry(function(a, b) {
	    var args = _slice(arguments);
	    args[0] = b;
	    args[1] = a;
	    return fn.apply(this, args);
	  });
	});


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	var curryN = __webpack_require__(29);
	
	
	/**
	 * Creates a function that will process either the `onTrue` or the `onFalse` function depending
	 * upon the result of the `condition` predicate.
	 *
	 * @func
	 * @memberOf R
	 * @category Logic
	 * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
	 * @param {Function} condition A predicate function
	 * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
	 * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
	 * @return {Function} A new unary function that will process either the `onTrue` or the `onFalse`
	 *                    function depending upon the result of the `condition` predicate.
	 * @example
	 *
	 *      // Flatten all arrays in the list but leave other values alone.
	 *      var flattenArrays = R.map(R.ifElse(Array.isArray, R.flatten, R.identity));
	 *
	 *      flattenArrays([[0], [[10], [8]], 1234, {}]); //=> [[0], [10, 8], 1234, {}]
	 *      flattenArrays([[[10], 123], [8, [10]], "hello"]); //=> [[10, 123], [8, 10], "hello"]
	 */
	module.exports = _curry3(function ifElse(condition, onTrue, onFalse) {
	  return curryN(Math.max(condition.length, onTrue.length, onFalse.length),
	    function _ifElse() {
	      return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
	    }
	  );
	});


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	
	
	/**
	 * Returns a function, `fn`, which encapsulates if/else-if/else logic.
	 * `R.cond` takes a list of [predicate, transform] pairs. All of the
	 * arguments to `fn` are applied to each of the predicates in turn
	 * until one returns a "truthy" value, at which point `fn` returns the
	 * result of applying its arguments to the corresponding transformer.
	 * If none of the predicates matches, `fn` returns undefined.
	 *
	 * @func
	 * @memberOf R
	 * @category Logic
	 * @sig [[(*... -> Boolean),(*... -> *)]] -> (*... -> *)
	 * @param {Array} pairs
	 * @return {Function}
	 * @example
	 *
	 *      var fn = R.cond([
	 *        [R.equals(0),   R.always('water freezes at 0°C')],
	 *        [R.equals(100), R.always('water boils at 100°C')],
	 *        [R.T,           function(temp) { return 'nothing special happens at ' + temp + '°C'; }]
	 *      ]);
	 *      fn(0); //=> 'water freezes at 0°C'
	 *      fn(50); //=> 'nothing special happens at 50°C'
	 *      fn(100); //=> 'water boils at 100°C'
	 */
	module.exports = _curry1(function cond(pairs) {
	  return function() {
	    var idx = 0;
	    while (idx < pairs.length) {
	      if (pairs[idx][0].apply(this, arguments)) {
	        return pairs[idx][1].apply(this, arguments);
	      }
	      idx += 1;
	    }
	  };
	});


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var always = __webpack_require__(53);
	
	
	/**
	 * A function that always returns `true`. Any passed in parameters are ignored.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig * -> true
	 * @return {Boolean} `true`.
	 * @see R.always, R.F
	 * @example
	 *
	 *      R.T(); //=> true
	 */
	module.exports = always(true);


/***/ },
/* 115 */
/***/ function(module, exports) {

	/**
	 * A special placeholder value used to specify "gaps" within curried functions,
	 * allowing partial application of any combination of arguments,
	 * regardless of their positions.
	 *
	 * If `g` is a curried ternary function and `_` is `R.__`, the following are equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2, _)(1, 3)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @constant
	 * @memberOf R
	 * @category Function
	 * @example
	 *
	 *      var greet = R.replace('{name}', R.__, 'Hello, {name}!');
	 *      greet('Alice'); //=> 'Hello, Alice!'
	 */
	module.exports = {'@@functional/placeholder': true};


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _xdrop = __webpack_require__(117);
	var slice = __webpack_require__(34);
	
	
	/**
	 * Returns all but the first `n` elements of the given list, string, or
	 * transducer/transformer (or object with a `drop` method).
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @see R.transduce
	 * @sig Number -> [a] -> [a]
	 * @sig Number -> String -> String
	 * @param {Number} n
	 * @param {*} list
	 * @return {*}
	 * @see R.take
	 * @example
	 *
	 *      R.drop(1, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
	 *      R.drop(2, ['foo', 'bar', 'baz']); //=> ['baz']
	 *      R.drop(3, ['foo', 'bar', 'baz']); //=> []
	 *      R.drop(4, ['foo', 'bar', 'baz']); //=> []
	 *      R.drop(3, 'ramda');               //=> 'da'
	 */
	module.exports = _curry2(_dispatchable('drop', _xdrop, function drop(n, xs) {
	  return slice(Math.max(0, n), Infinity, xs);
	}));


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _xfBase = __webpack_require__(22);
	
	
	module.exports = (function() {
	  function XDrop(n, xf) {
	    this.xf = xf;
	    this.n = n;
	  }
	  XDrop.prototype['@@transducer/init'] = _xfBase.init;
	  XDrop.prototype['@@transducer/result'] = _xfBase.result;
	  XDrop.prototype['@@transducer/step'] = function(result, input) {
	    if (this.n > 0) {
	      this.n -= 1;
	      return result;
	    }
	    return this.xf['@@transducer/step'](result, input);
	  };
	
	  return _curry2(function _xdrop(n, xf) { return new XDrop(n, xf); });
	})();


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _xfind = __webpack_require__(119);
	
	
	/**
	 * Returns the first element of the list which matches the predicate, or `undefined` if no
	 * element matches.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 * @see R.transduce
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> a | undefined
	 * @param {Function} fn The predicate function used to determine if the element is the
	 *        desired one.
	 * @param {Array} list The array to consider.
	 * @return {Object} The element found, or `undefined`.
	 * @example
	 *
	 *      var xs = [{a: 1}, {a: 2}, {a: 3}];
	 *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
	 *      R.find(R.propEq('a', 4))(xs); //=> undefined
	 */
	module.exports = _curry2(_dispatchable('find', _xfind, function find(fn, list) {
	  var idx = 0;
	  var len = list.length;
	  while (idx < len) {
	    if (fn(list[idx])) {
	      return list[idx];
	    }
	    idx += 1;
	  }
	}));


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _reduced = __webpack_require__(71);
	var _xfBase = __webpack_require__(22);
	
	
	module.exports = (function() {
	  function XFind(f, xf) {
	    this.xf = xf;
	    this.f = f;
	    this.found = false;
	  }
	  XFind.prototype['@@transducer/init'] = _xfBase.init;
	  XFind.prototype['@@transducer/result'] = function(result) {
	    if (!this.found) {
	      result = this.xf['@@transducer/step'](result, void 0);
	    }
	    return this.xf['@@transducer/result'](result);
	  };
	  XFind.prototype['@@transducer/step'] = function(result, input) {
	    if (this.f(input)) {
	      this.found = true;
	      result = _reduced(this.xf['@@transducer/step'](result, input));
	    }
	    return result;
	  };
	
	  return _curry2(function _xfind(f, xf) { return new XFind(f, xf); });
	})();


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _hasMethod = __webpack_require__(15);
	var _indexOf = __webpack_require__(121);
	
	
	/**
	 * Returns the position of the first occurrence of an item in an array,
	 * or -1 if the item is not included in the array. `R.equals` is used to
	 * determine equality.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig a -> [a] -> Number
	 * @param {*} target The item to find.
	 * @param {Array} xs The array to search in.
	 * @return {Number} the index of the target, or -1 if the target is not found.
	 * @see R.lastIndexOf
	 * @example
	 *
	 *      R.indexOf(3, [1,2,3,4]); //=> 2
	 *      R.indexOf(10, [1,2,3,4]); //=> -1
	 */
	module.exports = _curry2(function indexOf(target, xs) {
	  return _hasMethod('indexOf', xs) ? xs.indexOf(target) : _indexOf(xs, target, 0);
	});


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	var equals = __webpack_require__(41);
	
	
	module.exports = function _indexOf(list, item, from) {
	  var idx = from;
	  while (idx < list.length) {
	    if (equals(list[idx], item)) {
	      return idx;
	    }
	    idx += 1;
	  }
	  return -1;
	};


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	var equals = __webpack_require__(41);
	var propSatisfies = __webpack_require__(61);
	
	
	/**
	 * Returns `true` if the specified object property is equal, in `R.equals`
	 * terms, to the given value; `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @category Relation
	 * @sig String -> a -> Object -> Boolean
	 * @param {String} name
	 * @param {*} val
	 * @param {*} obj
	 * @return {Boolean}
	 * @see R.equals, R.propSatisfies
	 * @example
	 *
	 *      var abby = {name: 'Abby', age: 7, hair: 'blond'};
	 *      var fred = {name: 'Fred', age: 12, hair: 'brown'};
	 *      var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
	 *      var alois = {name: 'Alois', age: 15, disposition: 'surly'};
	 *      var kids = [abby, fred, rusty, alois];
	 *      var hasBrownHair = R.propEq('hair', 'brown');
	 *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
	 */
	module.exports = _curry3(function propEq(name, val, obj) {
	  return propSatisfies(equals(val), name, obj);
	});


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _xfindIndex = __webpack_require__(124);
	
	
	/**
	 * Returns the index of the first element of the list which matches the predicate, or `-1`
	 * if no element matches.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 * @see R.transduce
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> Number
	 * @param {Function} fn The predicate function used to determine if the element is the
	 * desired one.
	 * @param {Array} list The array to consider.
	 * @return {Number} The index of the element found, or `-1`.
	 * @example
	 *
	 *      var xs = [{a: 1}, {a: 2}, {a: 3}];
	 *      R.findIndex(R.propEq('a', 2))(xs); //=> 1
	 *      R.findIndex(R.propEq('a', 4))(xs); //=> -1
	 */
	module.exports = _curry2(_dispatchable('findIndex', _xfindIndex, function findIndex(fn, list) {
	  var idx = 0;
	  var len = list.length;
	  while (idx < len) {
	    if (fn(list[idx])) {
	      return idx;
	    }
	    idx += 1;
	  }
	  return -1;
	}));


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _reduced = __webpack_require__(71);
	var _xfBase = __webpack_require__(22);
	
	
	module.exports = (function() {
	  function XFindIndex(f, xf) {
	    this.xf = xf;
	    this.f = f;
	    this.idx = -1;
	    this.found = false;
	  }
	  XFindIndex.prototype['@@transducer/init'] = _xfBase.init;
	  XFindIndex.prototype['@@transducer/result'] = function(result) {
	    if (!this.found) {
	      result = this.xf['@@transducer/step'](result, -1);
	    }
	    return this.xf['@@transducer/result'](result);
	  };
	  XFindIndex.prototype['@@transducer/step'] = function(result, input) {
	    this.idx += 1;
	    if (this.f(input)) {
	      this.found = true;
	      result = _reduced(this.xf['@@transducer/step'](result, this.idx));
	    }
	    return result;
	  };
	
	  return _curry2(function _xfindIndex(f, xf) { return new XFindIndex(f, xf); });
	})();


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Acts as multiple `prop`: array of keys in, array of values out. Preserves order.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig [k] -> {k: v} -> [v]
	 * @param {Array} ps The property names to fetch
	 * @param {Object} obj The object to query
	 * @return {Array} The corresponding values or partially applied function.
	 * @example
	 *
	 *      R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]
	 *      R.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]
	 *
	 *      var fullName = R.compose(R.join(' '), R.props(['first', 'last']));
	 *      fullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'
	 */
	module.exports = _curry2(function props(ps, obj) {
	  var len = ps.length;
	  var out = [];
	  var idx = 0;
	
	  while (idx < len) {
	    out[idx] = obj[ps[idx]];
	    idx += 1;
	  }
	
	  return out;
	});


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _isArray = __webpack_require__(12);
	
	
	/**
	 * Creates a new object out of a list key-value pairs.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig [[k,v]] -> {k: v}
	 * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
	 * @return {Object} The object made by pairing up `keys` and `values`.
	 * @see R.toPairs
	 * @example
	 *
	 *      R.fromPairs([['a', 1], ['b', 2],  ['c', 3]]); //=> {a: 1, b: 2, c: 3}
	 */
	module.exports = _curry1(function fromPairs(pairs) {
	  var idx = 0, len = pairs.length, out = {};
	  while (idx < len) {
	    if (_isArray(pairs[idx]) && pairs[idx].length) {
	      out[pairs[idx][0]] = pairs[idx][1];
	    }
	    idx += 1;
	  }
	  return out;
	});


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var equals = __webpack_require__(41);
	var uniqWith = __webpack_require__(128);
	
	
	/**
	 * Returns a new list containing only one copy of each element in the original list.
	 * `R.equals` is used to determine equality.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig [a] -> [a]
	 * @param {Array} list The array to consider.
	 * @return {Array} The list of unique items.
	 * @example
	 *
	 *      R.uniq([1, 1, 2, 1]); //=> [1, 2]
	 *      R.uniq([1, '1']);     //=> [1, '1']
	 *      R.uniq([[42], [42]]); //=> [[42]]
	 */
	module.exports = uniqWith(equals);


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	var _containsWith = __webpack_require__(129);
	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Returns a new list containing only one copy of each element in the original list, based
	 * upon the value returned by applying the supplied predicate to two list elements. Prefers
	 * the first item if two items compare equal based on the predicate.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a, a -> Boolean) -> [a] -> [a]
	 * @param {Function} pred A predicate used to test whether two items are equal.
	 * @param {Array} list The array to consider.
	 * @return {Array} The list of unique items.
	 * @example
	 *
	 *      var strEq = function(a, b) { return String(a) === String(b); };
	 *      R.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]
	 *      R.uniqWith(strEq)([{}, {}]);       //=> [{}]
	 *      R.uniqWith(strEq)([1, '1', 1]);    //=> [1]
	 *      R.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']
	 */
	module.exports = _curry2(function uniqWith(pred, list) {
	  var idx = 0, len = list.length;
	  var result = [], item;
	  while (idx < len) {
	    item = list[idx];
	    if (!_containsWith(pred, item, result)) {
	      result[result.length] = item;
	    }
	    idx += 1;
	  }
	  return result;
	});


/***/ },
/* 129 */
/***/ function(module, exports) {

	module.exports = function _containsWith(pred, x, list) {
	  var idx = 0, len = list.length;
	  while (idx < len) {
	    if (pred(x, list[idx])) {
	      return true;
	    }
	    idx += 1;
	  }
	  return false;
	};


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _slice = __webpack_require__(19);
	var _xtakeWhile = __webpack_require__(131);
	
	
	/**
	 * Returns a new list containing the first `n` elements of a given list, passing each value
	 * to the supplied predicate function, and terminating when the predicate function returns
	 * `false`. Excludes the element that caused the predicate function to fail. The predicate
	 * function is passed one argument: *(value)*.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 * @see R.transduce
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} fn The function called per iteration.
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} A new array.
	 * @see R.dropWhile
	 * @example
	 *
	 *      var isNotFour = function(x) {
	 *        return !(x === 4);
	 *      };
	 *
	 *      R.takeWhile(isNotFour, [1, 2, 3, 4]); //=> [1, 2, 3]
	 */
	module.exports = _curry2(_dispatchable('takeWhile', _xtakeWhile, function takeWhile(fn, list) {
	  var idx = 0, len = list.length;
	  while (idx < len && fn(list[idx])) {
	    idx += 1;
	  }
	  return _slice(list, 0, idx);
	}));


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _reduced = __webpack_require__(71);
	var _xfBase = __webpack_require__(22);
	
	
	module.exports = (function() {
	  function XTakeWhile(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }
	  XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
	  XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;
	  XTakeWhile.prototype['@@transducer/step'] = function(result, input) {
	    return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
	  };
	
	  return _curry2(function _xtakeWhile(f, xf) { return new XTakeWhile(f, xf); });
	})();


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _slice = __webpack_require__(19);
	
	/**
	 * Returns a new list containing the last `n` elements of a given list, passing each value
	 * to the supplied predicate function, and terminating when the predicate function returns
	 * `false`. Excludes the element that caused the predicate function to fail. The predicate
	 * function is passed one argument: *(value)*.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> Boolean) -> [a] -> [a]
	 * @param {Function} fn The function called per iteration.
	 * @param {Array} list The collection to iterate over.
	 * @return {Array} A new array.
	 * @see R.dropLastWhile
	 * @example
	 *
	 *      var isNotOne = function(x) {
	 *        return !(x === 1);
	 *      };
	 *
	 *      R.takeLastWhile(isNotOne, [1, 2, 3, 4]); //=> [2, 3, 4]
	 */
	module.exports = _curry2(function takeLastWhile(fn, list) {
	  var idx = list.length - 1;
	  while (idx >= 0 && fn(list[idx])) {
	    idx -= 1;
	  }
	  return _slice(list, idx + 1, Infinity);
	});


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var take = __webpack_require__(134);
	
	/**
	 * Returns a list containing all but the last `n` elements of the given `list`.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig Number -> [a] -> [a]
	 * @sig Number -> String -> String
	 * @param {Number} n The number of elements of `xs` to skip.
	 * @param {Array} xs The collection to consider.
	 * @return {Array}
	 * @see R.takeLast
	 * @example
	 *
	 *      R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
	 *      R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
	 *      R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
	 *      R.dropLast(4, ['foo', 'bar', 'baz']); //=> []
	 *      R.dropLast(3, 'ramda');               //=> 'ra'
	 */
	module.exports = _curry2(function dropLast(n, xs) {
	  return take(n < xs.length ? xs.length - n : 0, xs);
	});


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _xtake = __webpack_require__(135);
	var slice = __webpack_require__(34);
	
	
	/**
	 * Returns the first `n` elements of the given list, string, or
	 * transducer/transformer (or object with a `take` method).
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig Number -> [a] -> [a]
	 * @sig Number -> String -> String
	 * @param {Number} n
	 * @param {*} list
	 * @return {*}
	 * @see R.drop
	 * @example
	 *
	 *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
	 *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
	 *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	 *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	 *      R.take(3, 'ramda');               //=> 'ram'
	 *
	 *      var personnel = [
	 *        'Dave Brubeck',
	 *        'Paul Desmond',
	 *        'Eugene Wright',
	 *        'Joe Morello',
	 *        'Gerry Mulligan',
	 *        'Bob Bates',
	 *        'Joe Dodge',
	 *        'Ron Crotty'
	 *      ];
	 *
	 *      var takeFive = R.take(5);
	 *      takeFive(personnel);
	 *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
	 */
	module.exports = _curry2(_dispatchable('take', _xtake, function take(n, xs) {
	  return slice(0, n < 0 ? Infinity : n, xs);
	}));


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _reduced = __webpack_require__(71);
	var _xfBase = __webpack_require__(22);
	
	
	module.exports = (function() {
	  function XTake(n, xf) {
	    this.xf = xf;
	    this.n = n;
	  }
	  XTake.prototype['@@transducer/init'] = _xfBase.init;
	  XTake.prototype['@@transducer/result'] = _xfBase.result;
	  XTake.prototype['@@transducer/step'] = function(result, input) {
	    if (this.n === 0) {
	      return _reduced(result);
	    } else {
	      this.n -= 1;
	      return this.xf['@@transducer/step'](result, input);
	    }
	  };
	
	  return _curry2(function _xtake(n, xf) { return new XTake(n, xf); });
	})();


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(pipe, toPairs, groupBy, last, values, sortBy, head, map) {'use strict';
	
	exports.__esModule = true;
	
	var _orderOperations, _orderDirection;
	
	var mathOperations = {
	  EQUATE: 'EQUATE',
	  ADD: 'ADD',
	  SUBTRACT: 'SUBTRACT',
	  MULTIPLY: 'MULTIPLY',
	  DIVIDE: 'DIVIDE',
	  NEGATE: 'NEGATE',
	  EXPONENT: 'EXPONENT'
	};
	
	exports.mathOperations = mathOperations;
	var orderOperations = (_orderOperations = {}, _orderOperations[mathOperations.EQUATE] = 0, _orderOperations[mathOperations.ADD] = 1, _orderOperations[mathOperations.SUBTRACT] = 1, _orderOperations[mathOperations.MULTIPLY] = 2, _orderOperations[mathOperations.DIVIDE] = 2, _orderOperations[mathOperations.NEGATE] = 3, _orderOperations[mathOperations.EXPONENT] = 3, _orderOperations);
	
	exports.orderOperations = orderOperations;
	var operationsOrder = pipe(toPairs, groupBy(last), values, sortBy(pipe(head, last)), map(map(head)))(orderOperations);
	
	exports.operationsOrder = operationsOrder;
	var orderDirection = (_orderDirection = {}, _orderDirection[orderOperations[mathOperations.EQUATE]] = 'forwards', _orderDirection[orderOperations[mathOperations.ADD]] = 'forwards', _orderDirection[orderOperations[mathOperations.MULTIPLY]] = 'forwards', _orderDirection[orderOperations[mathOperations.EXPONENT]] = 'backwards', _orderDirection);
	exports.orderDirection = orderDirection;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27), __webpack_require__(49), __webpack_require__(137), __webpack_require__(77), __webpack_require__(139), __webpack_require__(50), __webpack_require__(65), __webpack_require__(16)))

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _reduce = __webpack_require__(7);
	var _xgroupBy = __webpack_require__(138);
	var append = __webpack_require__(23);
	
	
	/**
	 * Splits a list into sub-lists stored in an object, based on the result of calling a String-returning function
	 * on each element, and grouping the results according to values returned.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 * @see R.transduce
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> String) -> [a] -> {String: [a]}
	 * @param {Function} fn Function :: a -> String
	 * @param {Array} list The array to group
	 * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
	 *         that produced that key when passed to `fn`.
	 * @example
	 *
	 *      var byGrade = R.groupBy(function(student) {
	 *        var score = student.score;
	 *        return score < 65 ? 'F' :
	 *               score < 70 ? 'D' :
	 *               score < 80 ? 'C' :
	 *               score < 90 ? 'B' : 'A';
	 *      });
	 *      var students = [{name: 'Abby', score: 84},
	 *                      {name: 'Eddy', score: 58},
	 *                      // ...
	 *                      {name: 'Jack', score: 69}];
	 *      byGrade(students);
	 *      // {
	 *      //   'A': [{name: 'Dianne', score: 99}],
	 *      //   'B': [{name: 'Abby', score: 84}]
	 *      //   // ...,
	 *      //   'F': [{name: 'Eddy', score: 58}]
	 *      // }
	 */
	module.exports = _curry2(_dispatchable('groupBy', _xgroupBy, function groupBy(fn, list) {
	  return _reduce(function(acc, elt) {
	    var key = fn(elt);
	    acc[key] = append(elt, acc[key] || (acc[key] = []));
	    return acc;
	  }, {}, list);
	}));


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _has = __webpack_require__(43);
	var _xfBase = __webpack_require__(22);
	var append = __webpack_require__(23);
	
	
	module.exports = (function() {
	  function XGroupBy(f, xf) {
	    this.xf = xf;
	    this.f = f;
	    this.inputs = {};
	  }
	  XGroupBy.prototype['@@transducer/init'] = _xfBase.init;
	  XGroupBy.prototype['@@transducer/result'] = function(result) {
	    var key;
	    for (key in this.inputs) {
	      if (_has(key, this.inputs)) {
	        result = this.xf['@@transducer/step'](result, this.inputs[key]);
	        if (result['@@transducer/reduced']) {
	          result = result['@@transducer/value'];
	          break;
	        }
	      }
	    }
	    return this.xf['@@transducer/result'](result);
	  };
	  XGroupBy.prototype['@@transducer/step'] = function(result, input) {
	    var key = this.f(input);
	    this.inputs[key] = this.inputs[key] || [key, []];
	    this.inputs[key][1] = append(input, this.inputs[key][1]);
	    return result;
	  };
	
	  return _curry2(function _xgroupBy(f, xf) { return new XGroupBy(f, xf); });
	})();


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var keys = __webpack_require__(45);
	
	
	/**
	 * Returns a list of all the enumerable own properties of the supplied object.
	 * Note that the order of the output array is not guaranteed across
	 * different JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig {k: v} -> [v]
	 * @param {Object} obj The object to extract values from
	 * @return {Array} An array of the values of the object's own properties.
	 * @example
	 *
	 *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
	 */
	module.exports = _curry1(function values(obj) {
	  var props = keys(obj);
	  var len = props.length;
	  var vals = [];
	  var idx = 0;
	  while (idx < len) {
	    vals[idx] = obj[props[idx]];
	    idx += 1;
	  }
	  return vals;
	});


/***/ },
/* 140 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var entity = {
	  type: 'ENTITY',
	  value: null,
	  units: {},
	  symbols: {}
	};
	
	exports.entity = entity;
	var compositeEntity = {
	  type: 'COMPOSITE_ENTITY',
	  entity: null,
	  value: null
	};
	
	exports.compositeEntity = compositeEntity;
	var operationsGroup = {
	  type: 'OPERATIONS_GROUP',
	  groups: [],
	  operations: [],
	  level: -1
	};
	exports.operationsGroup = operationsGroup;

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(toString, complement, isNil, pipe, map, last, sum, ifElse, always, prop, has, toPairs, filter, head, partial, length, keys, pickBy, reduce, evolve, multiply, omit, groupBy, mapObj, __, chain, adjust, fromPairs, equals) {'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.isResolvable = isResolvable;
	exports.convert = convert;
	exports.convertComposite = convertComposite;
	exports.toSi = toSi;
	exports.toString = toString;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _descriptors = __webpack_require__(140);
	
	var _dataUnitsDerived = __webpack_require__(156);
	
	var _dataUnitsDerived2 = _interopRequireDefault(_dataUnitsDerived);
	
	var _locale = __webpack_require__(75);
	
	var _util = __webpack_require__(96);
	
	var notNil = complement(isNil);
	var sumLastElementsInPairs = pipe(map(last), sum);
	
	// (context, name: string) -> string?
	var getUnitType = pipe(_locale.getUnitValue, ifElse(isNil, always(null), prop('type')));
	
	// (context, name: string) -> bool
	var isNonLinearUnit = pipe(_locale.getUnitValue, ifElse(notNil, has('forwardFn'), always(false)));
	
	function getNonLinearUnitPairs(context, units) {
	  return pipe(toPairs, filter(pipe(head, partial(isNonLinearUnit, context))))(units);
	}
	
	function isResolvable(context, entity) {
	  var units = entity.units;
	
	  var nonLinearUnits = getNonLinearUnitPairs(context, units);
	  var nonLinearUnitsSize = length(nonLinearUnits);
	
	  if (nonLinearUnitsSize > 0) {
	    var unitsSize = pipe(keys, length)(units);
	    var linearUnitsSize = unitsSize - nonLinearUnitsSize;
	    var nonLinearUnitPower = pipe(head, last)(nonLinearUnits);
	
	    if (nonLinearUnitsSize > 1 || linearUnitsSize > 0 || nonLinearUnitPower !== 1) {
	      return false;
	    }
	  }
	
	  return true;
	}
	
	var resolveDimensionlessUnits = function resolveDimensionlessUnits(context, entity) {
	  return pipe(prop('units'), pickBy(function (power, unit) {
	    return !getUnitType(context, unit);
	  }), toPairs, reduce(function (out, _ref) {
	    var unit = _ref[0];
	    var power = _ref[1];
	
	    var unitValue = Math.pow(_locale.getUnitValue(context, unit).base, power);
	
	    return evolve({
	      value: multiply(unitValue),
	      units: omit([unit])
	    }, out);
	  }, entity))(entity);
	};
	
	exports.resolveDimensionlessUnits = resolveDimensionlessUnits;
	var dimensions = function dimensions(context, entity) {
	  return pipe(prop('units'), toPairs, groupBy(function (_ref2) {
	    var unit = _ref2[0];
	
	    var unitValue = _locale.getUnitValue(context, unit);
	    return unitValue ? String(unitValue.type) : unit;
	  }), omit(['undefined']), mapObj(sumLastElementsInPairs), pickBy(notNil))(entity);
	};
	
	exports.dimensions = dimensions;
	var derivedUnitsForType = ifElse(has(__, _dataUnitsDerived2['default']), pipe(prop(__, _dataUnitsDerived2['default']), toPairs), function (type) {
	  return [[type, 1]];
	});
	
	// context, entity
	var baseDimensions = pipe(dimensions, toPairs, chain(function (_ref3) {
	  var type = _ref3[0];
	  var value = _ref3[1];
	  return map(adjust(multiply(value), -1), derivedUnitsForType(type));
	}), groupBy(head), mapObj(sumLastElementsInPairs), pickBy(notNil));
	
	exports.baseDimensions = baseDimensions;
	function getSiUnits(context, entity) {
	  return pipe(dimensions, toPairs, map(adjust(partial(_locale.getSiUnit, context), 0)), fromPairs)(context, entity);
	}
	
	function convertValueReducerFn(context, direction, value, _ref4) {
	  var name = _ref4[0];
	  var power = _ref4[1];
	
	  var unit = _locale.getUnitValue(context, name);
	
	  if (unit) {
	    return value * Math.pow(unit.base, -direction * power);
	  }
	  return value;
	}
	
	function convertValue(context, direction, units, value) {
	  var nonLinearUnits = getNonLinearUnitPairs(context, units);
	  var nonLinearUnit = pipe(map(head), head)(nonLinearUnits);
	
	  if (nonLinearUnit) {
	    var fn = ({
	      '1': 'forwardFn',
	      '-1': 'backwardFn'
	    })[direction];
	
	    var unit = _locale.getUnitValue(context, nonLinearUnit);
	    return unit[fn](value);
	  }
	
	  return reduce(partial(convertValueReducerFn, context, direction), value, toPairs(units));
	}
	
	function convert(context, units, entity) {
	  var entityBaseDimensions = baseDimensions(context, entity);
	  var unitBaseDimensions = baseDimensions(context, _extends({}, _descriptors.entity, { units: units }));
	
	  var dimensionsMatch = equals(entityBaseDimensions, unitBaseDimensions);
	  var entityIsResolvable = isResolvable(context, entity);
	
	  if (!dimensionsMatch || !entityIsResolvable) {
	    return null;
	  }
	
	  var value = pipe(partial(convertValue, context, -1, entity.units), partial(convertValue, context, 1, units))(entity.value);
	  return _extends({}, entity, { value: value, units: units });
	}
	
	function floorEntityAccum(context, entity, units) {
	  var exactEntity = convert(context, units, entity);
	  var compositeEntity = _extends({}, exactEntity, { value: Math.floor(exactEntity.value) });
	  var remainder = _extends({}, exactEntity, { value: exactEntity.value - compositeEntity.value });
	
	  return [remainder, compositeEntity];
	}
	
	function convertComposite(context, unitArray, entity) {
	  var value = _util.mapWithAccum(partial(floorEntityAccum, context), entity, unitArray);
	  return {
	    type: 'COMPOSITE_ENTITY',
	    entity: entity,
	    value: value
	  };
	}
	
	function toSi(context, entity) {
	  var resolvedEntity = resolveDimensionlessUnits(context, entity);
	  return convert(context, getSiUnits(context, resolvedEntity), resolvedEntity);
	}
	
	var isCurrency = pipe(dimensions, equls({ currency: 1 }));
	
	function toString(context, entity) {
	  var entityIsCurrency = isCurrency(context, entity);
	
	  if (entityIsCurrency) {
	    return _locale.formatCurrencyEntity(context, entity);
	  }
	
	  return _locale.formatEntity(context, entity);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(142), __webpack_require__(101), __webpack_require__(60), __webpack_require__(27), __webpack_require__(16), __webpack_require__(77), __webpack_require__(37), __webpack_require__(112), __webpack_require__(53), __webpack_require__(36), __webpack_require__(147), __webpack_require__(49), __webpack_require__(57), __webpack_require__(65), __webpack_require__(81), __webpack_require__(99), __webpack_require__(45), __webpack_require__(39), __webpack_require__(31), __webpack_require__(108), __webpack_require__(148), __webpack_require__(149), __webpack_require__(137), __webpack_require__(47), __webpack_require__(115), __webpack_require__(150), __webpack_require__(52), __webpack_require__(126), __webpack_require__(41)))

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _toString = __webpack_require__(143);
	
	
	/**
	 * Returns the string representation of the given value. `eval`'ing the output
	 * should result in a value equivalent to the input value. Many of the built-in
	 * `toString` methods do not satisfy this requirement.
	 *
	 * If the given value is an `[object Object]` with a `toString` method other
	 * than `Object.prototype.toString`, this method is invoked with no arguments
	 * to produce the return value. This means user-defined constructor functions
	 * can provide a suitable `toString` method. For example:
	 *
	 *     function Point(x, y) {
	 *       this.x = x;
	 *       this.y = y;
	 *     }
	 *
	 *     Point.prototype.toString = function() {
	 *       return 'new Point(' + this.x + ', ' + this.y + ')';
	 *     };
	 *
	 *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
	 *
	 * @func
	 * @memberOf R
	 * @category String
	 * @sig * -> String
	 * @param {*} val
	 * @return {String}
	 * @example
	 *
	 *      R.toString(42); //=> '42'
	 *      R.toString('abc'); //=> '"abc"'
	 *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
	 *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
	 *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
	 */
	module.exports = _curry1(function toString(val) { return _toString(val, []); });


/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(144);
	var _map = __webpack_require__(20);
	var _quote = __webpack_require__(145);
	var _toISOString = __webpack_require__(146);
	var keys = __webpack_require__(45);
	var reject = __webpack_require__(55);
	var test = __webpack_require__(73);
	
	
	module.exports = function _toString(x, seen) {
	  var recur = function recur(y) {
	    var xs = seen.concat([x]);
	    return _contains(y, xs) ? '<Circular>' : _toString(y, xs);
	  };
	
	  //  mapPairs :: (Object, [String]) -> [String]
	  var mapPairs = function(obj, keys) {
	    return _map(function(k) { return _quote(k) + ': ' + recur(obj[k]); }, keys.slice().sort());
	  };
	
	  switch (Object.prototype.toString.call(x)) {
	    case '[object Arguments]':
	      return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
	    case '[object Array]':
	      return '[' + _map(recur, x).concat(mapPairs(x, reject(test(/^\d+$/), keys(x)))).join(', ') + ']';
	    case '[object Boolean]':
	      return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
	    case '[object Date]':
	      return 'new Date(' + _quote(_toISOString(x)) + ')';
	    case '[object Null]':
	      return 'null';
	    case '[object Number]':
	      return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
	    case '[object String]':
	      return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
	    case '[object Undefined]':
	      return 'undefined';
	    default:
	      return (typeof x.constructor === 'function' && x.constructor.name !== 'Object' &&
	              typeof x.toString === 'function' && x.toString() !== '[object Object]') ?
	             x.toString() :  // Function, RegExp, user-defined types
	             '{' + mapPairs(x, keys(x)).join(', ') + '}';
	  }
	};


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	var _indexOf = __webpack_require__(121);
	
	
	module.exports = function _contains(a, list) {
	  return _indexOf(list, a, 0) >= 0;
	};


/***/ },
/* 145 */
/***/ function(module, exports) {

	module.exports = function _quote(s) {
	  return '"' + s.replace(/"/g, '\\"') + '"';
	};


/***/ },
/* 146 */
/***/ function(module, exports) {

	/**
	 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
	 */
	module.exports = (function() {
	  var pad = function pad(n) { return (n < 10 ? '0' : '') + n; };
	
	  return typeof Date.prototype.toISOString === 'function' ?
	    function _toISOString(d) {
	      return d.toISOString();
	    } :
	    function _toISOString(d) {
	      return (
	        d.getUTCFullYear() + '-' +
	        pad(d.getUTCMonth() + 1) + '-' +
	        pad(d.getUTCDate()) + 'T' +
	        pad(d.getUTCHours()) + ':' +
	        pad(d.getUTCMinutes()) + ':' +
	        pad(d.getUTCSeconds()) + '.' +
	        (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z'
	      );
	    };
	}());


/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _has = __webpack_require__(43);
	
	
	/**
	 * Returns whether or not an object has an own property with
	 * the specified name
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig s -> {s: x} -> Boolean
	 * @param {String} prop The name of the property to check for.
	 * @param {Object} obj The object to query.
	 * @return {Boolean} Whether the property exists.
	 * @example
	 *
	 *      var hasName = R.has('name');
	 *      hasName({name: 'alice'});   //=> true
	 *      hasName({name: 'bob'});     //=> true
	 *      hasName({});                //=> false
	 *
	 *      var point = {x: 0, y: 0};
	 *      var pointHas = R.has(R.__, point);
	 *      pointHas('x');  //=> true
	 *      pointHas('y');  //=> true
	 *      pointHas('z');  //=> false
	 */
	module.exports = _curry2(_has);


/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Multiplies two numbers. Equivalent to `a * b` but curried.
	 *
	 * @func
	 * @memberOf R
	 * @category Math
	 * @sig Number -> Number -> Number
	 * @param {Number} a The first value.
	 * @param {Number} b The second value.
	 * @return {Number} The result of `a * b`.
	 * @see R.divide
	 * @example
	 *
	 *      var double = R.multiply(2);
	 *      var triple = R.multiply(3);
	 *      double(3);       //=>  6
	 *      triple(4);       //=> 12
	 *      R.multiply(2, 5);  //=> 10
	 */
	module.exports = _curry2(function multiply(a, b) { return a * b; });


/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(144);
	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Returns a partial copy of an object omitting the keys specified.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig [String] -> {String: *} -> {String: *}
	 * @param {Array} names an array of String property names to omit from the new object
	 * @param {Object} obj The object to copy from
	 * @return {Object} A new object with properties from `names` not on it.
	 * @see R.pick
	 * @example
	 *
	 *      R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
	 */
	module.exports = _curry2(function omit(names, obj) {
	  var result = {};
	  for (var prop in obj) {
	    if (!_contains(prop, names)) {
	      result[prop] = obj[prop];
	    }
	  }
	  return result;
	});


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _dispatchable = __webpack_require__(17);
	var _xchain = __webpack_require__(151);
	var map = __webpack_require__(16);
	var unnest = __webpack_require__(154);
	
	
	/**
	 * `chain` maps a function over a list and concatenates the results.
	 * This implementation is compatible with the
	 * Fantasy-land Chain spec, and will work with types that implement that spec.
	 * `chain` is also known as `flatMap` in some libraries
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig (a -> [b]) -> [a] -> [b]
	 * @param {Function} fn
	 * @param {Array} list
	 * @return {Array}
	 * @example
	 *
	 *      var duplicate = function(n) {
	 *        return [n, n];
	 *      };
	 *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
	 */
	module.exports = _curry2(_dispatchable('chain', _xchain, function chain(fn, list) {
	  return unnest(map(fn, list));
	}));


/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	var _flatCat = __webpack_require__(152);
	var map = __webpack_require__(16);
	
	
	module.exports = _curry2(function _xchain(f, xf) {
	  return map(f, _flatCat(xf));
	});


/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	var _forceReduced = __webpack_require__(153);
	var _reduce = __webpack_require__(7);
	var _xfBase = __webpack_require__(22);
	var isArrayLike = __webpack_require__(11);
	
	module.exports = (function() {
	  var preservingReduced = function(xf) {
	    return {
	      '@@transducer/init': _xfBase.init,
	      '@@transducer/result': function(result) {
	        return xf['@@transducer/result'](result);
	      },
	      '@@transducer/step': function(result, input) {
	        var ret = xf['@@transducer/step'](result, input);
	        return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
	      }
	    };
	  };
	
	  return function _xcat(xf) {
	    var rxf = preservingReduced(xf);
	    return {
	      '@@transducer/init': _xfBase.init,
	      '@@transducer/result': function(result) {
	        return rxf['@@transducer/result'](result);
	      },
	      '@@transducer/step': function(result, input) {
	        return !isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
	      }
	    };
	  };
	}());


/***/ },
/* 153 */
/***/ function(module, exports) {

	module.exports = function _forceReduced(x) {
	  return {
	      '@@transducer/value': x,
	      '@@transducer/reduced': true
	    };
	};


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _makeFlat = __webpack_require__(155);
	
	
	/**
	 * Returns a new list by pulling every item at the first level of nesting out, and putting
	 * them in a new array.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig [a] -> [b]
	 * @param {Array} list The array to consider.
	 * @return {Array} The flattened list.
	 * @see R.flatten
	 * @example
	 *
	 *      R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
	 *      R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
	 */
	module.exports = _curry1(_makeFlat(false));


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(11);
	
	
	/**
	 * `_makeFlat` is a helper function that returns a one-level or fully recursive function
	 * based on the flag passed in.
	 *
	 * @private
	 */
	module.exports = function _makeFlat(recursive) {
	  return function flatt(list) {
	    var value, result = [], idx = 0, j, ilen = list.length, jlen;
	    while (idx < ilen) {
	      if (isArrayLike(list[idx])) {
	        value = recursive ? flatt(list[idx]) : list[idx];
	        j = 0;
	        jlen = value.length;
	        while (j < jlen) {
	          result[result.length] = value[j];
	          j += 1;
	        }
	      } else {
	        result[result.length] = list[idx];
	      }
	      idx += 1;
	    }
	    return result;
	  };
	};


/***/ },
/* 156 */
/***/ function(module, exports) {

	module.exports = {
		"area": {
			"length": 2
		},
		"volume": {
			"length": 3
		},
		"power": {
			"energy": 1,
			"time": -1
		}
	}

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(any, isNil, pipe, always, reduced, ifElse, identity, prop, map, partial, propEq, __, reverse, reduce, head, zip, tail, nthArg, length, equals, mapObj, propOr, values, isEmpty, sum, evolve, multiply, omit, keys, over, lens, assoc, converge) {/* eslint no-use-before-define: [1, "nofunc"] */
	'use strict';
	
	exports.__esModule = true;
	exports.resolveWithLocals = resolveWithLocals;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _mathMath = __webpack_require__(163);
	
	var math = _interopRequireWildcard(_mathMath);
	
	var _combineValues = __webpack_require__(170);
	
	var _combineValues2 = _interopRequireDefault(_combineValues);
	
	var _constants = __webpack_require__(136);
	
	var containsNil = any(isNil);
	var finalNil = pipe(always(reduced(null)));
	
	var resolveBreakNil = function resolveBreakNil(fn) {
	  return pipe(fn, ifElse(isNil, finalNil, identity));
	};
	
	var groupsResolver = function groupsResolver(reducer) {
	  return function (context, locals, group) {
	    return pipe(prop('groups'), map(partial(resolveWithLocals, context, locals)), ifElse(containsNil, always(null), partial(reducer, context, group)))(group);
	  };
	};
	
	var resolveOperationsGroupBackwardsFn = resolveBreakNil(function (context, b, _ref) {
	  var operation = _ref[0];
	  var a = _ref[1];
	  return math[operation](context, a, b);
	});
	var resolveOperationsGroupForwardsFn = resolveBreakNil(function (context, a, _ref2) {
	  var operation = _ref2[0];
	  var b = _ref2[1];
	  return math[operation](context, a, b);
	});
	var groupIsBackwards = pipe(prop('level'), propEq(__, 'backwards', _constants.orderDirection));
	var resolveOperationsGroup = function resolveOperationsGroup(context, locals, group) {
	  var unresolvedGroups = group.groups;
	  var operations = group.operations;
	
	  var groups = map(partial(resolveWithLocals, context, locals), unresolvedGroups); // FIXME: This is shitty
	  var isBackwards = groupIsBackwards(group);
	
	  if (containsNil(groups)) {
	    return null;
	  }
	
	  var fixedOperations = isBackwards ? reverse(operations) : operations;
	  var fixedGroups = isBackwards ? reverse(groups) : groups;
	  var resolveFn = isBackwards ? resolveOperationsGroupBackwardsFn : resolveOperationsGroupForwardsFn;
	
	  return reduce(partial(resolveFn, context), head(fixedGroups), zip(fixedOperations, tail(fixedGroups)));
	};
	
	var resolveMiscGroupReduceFn = resolveBreakNil(_combineValues2['default']);
	var resolveMiscGroupReducer = function resolveMiscGroupReducer(context, locals, group) {
	  return reduce(partial(resolveMiscGroupReduceFn, context), head(group), tail(group));
	};
	var resolveMiscGroup = groupsResolver(resolveMiscGroupReducer);
	
	var resolveBracketGroupHasOneGroup = pipe(nthArg(2), prop('groups'), length, equals(1));
	var resolveBracketGroup = ifElse(resolveBracketGroupHasOneGroup, resolveMiscGroup, always(null));
	
	var resolveEntity = function resolveEntity(context, locals, entity) {
	  var symbolsMultilicationFactor = pipe(mapObj(function (key, value) {
	    return value * propOr(key, 0, entity.symbols);
	  }), values, ifElse(isEmpty, always(1), sum))(locals);
	
	  return evolve({
	    value: multiply(symbolsMultilicationFactor),
	    symbols: omit(keys(locals))
	  })(entity);
	};
	
	function resolveWithLocals(context, locals, value) {
	  switch (value.type) {
	    case 'OPERATIONS_GROUP':
	      return resolveOperationsGroup(context, locals, value);
	    case 'MISC_GROUP':
	      return resolveMiscGroup(context, locals, value);
	    case 'BRACKETS_GROUP':
	      return resolveBracketGroup(context, locals, value);
	    case 'ENTITY':
	      return resolveEntity(context, locals, value);
	    default:
	      return value;
	  }
	}
	
	var resolve = over(lens(identity, assoc('result')), converge(resolveWithLocals, identity, always({}), prop('ast')));
	exports['default'] = resolve;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(72), __webpack_require__(60), __webpack_require__(27), __webpack_require__(53), __webpack_require__(158), __webpack_require__(112), __webpack_require__(24), __webpack_require__(36), __webpack_require__(16), __webpack_require__(81), __webpack_require__(122), __webpack_require__(115), __webpack_require__(159), __webpack_require__(31), __webpack_require__(65), __webpack_require__(94), __webpack_require__(32), __webpack_require__(160), __webpack_require__(99), __webpack_require__(41), __webpack_require__(47), __webpack_require__(161), __webpack_require__(139), __webpack_require__(80), __webpack_require__(37), __webpack_require__(108), __webpack_require__(148), __webpack_require__(149), __webpack_require__(45), __webpack_require__(62), __webpack_require__(63), __webpack_require__(64), __webpack_require__(162)))

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _reduced = __webpack_require__(71);
	
	/**
	 * Returns a value wrapped to indicate that it is the final value of the
	 * reduce and transduce functions.  The returned value
	 * should be considered a black box: the internal structure is not
	 * guaranteed to be stable.
	 *
	 * Note: this optimization is unavailable to functions not explicitly listed
	 * above.  For instance, it is not currently supported by reduceIndexed,
	 * reduceRight, or reduceRightIndexed.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @see R.reduce, R.transduce
	 * @sig a -> *
	 * @param {*} x The final value of the reduce.
	 * @return {*} The wrapped value.
	 * @example
	 *
	 *      R.reduce(
	 *        R.pipe(R.add, R.ifElse(R.lte(10), R.reduced, R.identity)),
	 *        0,
	 *        [1, 2, 3, 4, 5]) // 10
	 */
	
	module.exports = _curry1(_reduced);


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var _slice = __webpack_require__(19);
	
	
	/**
	 * Returns a new list with the same elements as the original list, just
	 * in the reverse order.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig [a] -> [a]
	 * @param {Array} list The list to reverse.
	 * @return {Array} A copy of the list in reverse order.
	 * @example
	 *
	 *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
	 *      R.reverse([1, 2]);     //=> [2, 1]
	 *      R.reverse([1]);        //=> [1]
	 *      R.reverse([]);         //=> []
	 */
	module.exports = _curry1(function reverse(list) {
	  return _slice(list).reverse();
	});


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	var _curry1 = __webpack_require__(5);
	var nth = __webpack_require__(66);
	
	
	/**
	 * Returns a function which returns its nth argument.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig Number -> *... -> *
	 * @param {Number} n
	 * @return {Function}
	 * @example
	 *
	 *      R.nthArg(1)('a', 'b', 'c'); //=> 'b'
	 *      R.nthArg(-1)('a', 'b', 'c'); //=> 'c'
	 */
	module.exports = _curry1(function nthArg(n) {
	  return function() {
	    return nth(n, arguments);
	  };
	});


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	var _curry3 = __webpack_require__(4);
	var _has = __webpack_require__(43);
	
	
	/**
	 * If the given, non-null object has an own property with the specified name,
	 * returns the value of that property.
	 * Otherwise returns the provided default value.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig a -> String -> Object -> a
	 * @param {*} val The default value.
	 * @param {String} p The name of the property to return.
	 * @param {Object} obj The object to query.
	 * @return {*} The value of given property of the supplied object or the default value.
	 * @example
	 *
	 *      var alice = {
	 *        name: 'ALICE',
	 *        age: 101
	 *      };
	 *      var favorite = R.prop('favoriteLibrary');
	 *      var favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');
	 *
	 *      favorite(alice);  //=> undefined
	 *      favoriteWithDefault(alice);  //=> 'Ramda'
	 */
	module.exports = _curry3(function propOr(val, p, obj) {
	  return (obj != null && _has(p, obj)) ? obj[p] : val;
	});


/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	var _map = __webpack_require__(20);
	var _slice = __webpack_require__(19);
	var curryN = __webpack_require__(29);
	var pluck = __webpack_require__(35);
	
	
	/**
	 * Accepts at least three functions and returns a new function. When invoked, this new
	 * function will invoke the first function, `after`, passing as its arguments the
	 * results of invoking the subsequent functions with whatever arguments are passed to
	 * the new function.
	 *
	 * @func
	 * @memberOf R
	 * @category Function
	 * @sig (x1 -> x2 -> ... -> z) -> ((a -> b -> ... -> x1), (a -> b -> ... -> x2), ...) -> (a -> b -> ... -> z)
	 * @param {Function} after A function. `after` will be invoked with the return values of
	 *        `fn1` and `fn2` as its arguments.
	 * @param {...Function} functions A variable number of functions.
	 * @return {Function} A new function.
	 * @example
	 *
	 *      var add = function(a, b) { return a + b; };
	 *      var multiply = function(a, b) { return a * b; };
	 *      var subtract = function(a, b) { return a - b; };
	 *
	 *      //≅ multiply( add(1, 2), subtract(1, 2) );
	 *      R.converge(multiply, add, subtract)(1, 2); //=> -3
	 *
	 *      var add3 = function(a, b, c) { return a + b + c; };
	 *      R.converge(add3, multiply, add, subtract)(1, 2); //=> 4
	 */
	module.exports = curryN(3, function converge(after) {
	  var fns = _slice(arguments, 1);
	  return curryN(Math.max.apply(Math, pluck('length', fns)), function() {
	    var args = arguments;
	    var context = this;
	    return after.apply(context, _map(function(fn) {
	      return fn.apply(context, args);
	    }, fns));
	  });
	});


/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(path) {'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _typesDescriptors = __webpack_require__(140);
	
	var _entity = __webpack_require__(165);
	
	var entityMath = _interopRequireWildcard(_entity);
	
	var negativeEntity = _extends({}, _typesDescriptors.entity, { value: -1 });
	
	var addValueMap = {
	  ENTITY: {
	    ENTITY: entityMath.add
	  }
	};
	var subtractValueMap = {
	  ENTITY: {
	    ENTITY: entityMath.subtract
	  }
	};
	var multiplyValueMap = {
	  ENTITY: {
	    ENTITY: entityMath.multiply
	  }
	};
	var divideValueMap = {
	  ENTITY: {
	    ENTITY: entityMath.divide
	  }
	};
	var negateValueMap = {
	  EMPTY: {
	    ENTITY: function ENTITY(context, lhs, rhs) {
	      return entityMath.multiply(context, negativeEntity, rhs);
	    }
	  }
	};
	var exponentValueMap = {
	  ENTITY: {
	    ENTITY: entityMath.exponent
	  }
	};
	
	var createOperation = function createOperation(valueMap) {
	  return function (context, lhs, rhs) {
	    var fn = path([lhs.type, rhs.type], valueMap);
	    return fn ? fn(context, lhs, rhs) : null;
	  };
	};
	
	var ADD = createOperation(addValueMap);
	exports.ADD = ADD;
	var SUBTRACT = createOperation(subtractValueMap);
	exports.SUBTRACT = SUBTRACT;
	var MULTIPLY = createOperation(multiplyValueMap);
	exports.MULTIPLY = MULTIPLY;
	var DIVIDE = createOperation(divideValueMap);
	exports.DIVIDE = DIVIDE;
	var NEGATE = createOperation(negateValueMap);
	exports.NEGATE = NEGATE;
	var EXPONENT = createOperation(exponentValueMap);
	exports.EXPONENT = EXPONENT;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(164)))

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Retrieve the value at a given path.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig [String] -> {k: v} -> v | Undefined
	 * @param {Array} path The path to use.
	 * @return {*} The data at `path`.
	 * @example
	 *
	 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
	 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
	 */
	module.exports = _curry2(function path(paths, obj) {
	  if (obj == null) {
	    return;
	  } else {
	    var val = obj;
	    for (var idx = 0, len = paths.length; idx < len && val != null; idx += 1) {
	      val = val[paths[idx]];
	    }
	    return val;
	  }
	});


/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(complement, isEmpty, equals, pipe, map, last, sum, always, propEq, propSatisfies, isNil, nthArg, prop, keys, length, converge, either, cond, T, both, intersection, toPairs, concat, groupBy, head, mapObj, pickBy, multiply, partial) {'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _typesDescriptors = __webpack_require__(140);
	
	var _typesEntity = __webpack_require__(141);
	
	var notEmpty = complement(isEmpty);
	var notZero = complement(equals(0));
	var sumLastElementsInPairs = pipe(map(last), sum);
	
	var toNil = always(null);
	var toZeroEntity = always(_extends({}, _typesDescriptors.entity, { value: 0 }));
	
	var valueZero = propEq('value', 0);
	var valueNil = propSatisfies(isNil, 'value');
	
	var sign = nthArg(0);
	var context = nthArg(1);
	
	// FIXME: All shitty. Just pipe(lhs, valueZero) etc. See combineValues
	var lhs = nthArg(2);
	var lhsValueZero = pipe(lhs, valueZero);
	var lhsValueNil = pipe(lhs, valueNil);
	var lhsUnits = pipe(lhs, prop('units'));
	var lhsUnitKeys = pipe(lhsUnits, keys);
	var lhsUnitKeysLength = pipe(lhsUnitKeys, length);
	var lhsSymbols = pipe(lhs, prop('symbols'));
	var lhsBaseDimensions = converge(_typesEntity.baseDimensions, context, lhs);
	var lhsToSi = converge(_typesEntity.toSi, context, lhs);
	
	var rhs = nthArg(3);
	var rhsValueZero = pipe(rhs, valueZero);
	var rhsValueNil = pipe(rhs, valueNil);
	var rhsUnits = pipe(rhs, prop('units'));
	var rhsUnitKeys = pipe(rhsUnits, keys);
	var rhsUnitKeysLength = pipe(rhsUnitKeys, length);
	var rhsSymbols = pipe(rhs, prop('symbols'));
	var rhsBaseDimensions = converge(_typesEntity.baseDimensions, context, rhs);
	var rhsToSi = converge(_typesEntity.toSi, context, rhs);
	var rhsHasUnits = pipe(rhsUnitKeys, notEmpty);
	var rhsHasSymbols = pipe(rhsSymbols, keys, notEmpty);
	var rhsNotPureNumericEntity = either(rhsHasUnits, rhsHasSymbols);
	
	var eitherValueNil = either(lhsValueNil, rhsValueNil);
	
	var symbolsMatch = converge(equals, lhsSymbols, rhsSymbols);
	var symbolsDiffer = complement(symbolsMatch);
	var unitsMatch = converge(equals, lhsUnits, rhsUnits);
	var baseDimensionsMatch = converge(equals, lhsBaseDimensions, rhsBaseDimensions);
	
	var flipRhsBySign = function flipRhsBySign(direction, ctx, left, right) {
	  return _extends({}, right, { value: right.value * direction });
	};
	var performAddMath = function performAddMath(direction, ctx, left, right) {
	  return _extends({}, left, { value: left.value + right.value * direction });
	};
	// (sign: (1, -1), context: Context, lhs: Entity, rhs: Entity) => Entity
	var abstractMathAdd = cond([[eitherValueNil, toNil], [rhsValueZero, lhs], [lhsValueZero, flipRhsBySign], [symbolsDiffer, toNil], [unitsMatch, performAddMath], [baseDimensionsMatch, converge(performAddMath, sign, context, lhsToSi, rhsToSi)], [T, toNil]]);
	
	var rhsIsZeroAndNotDivision = both(rhsValueZero, pipe(sign, equals(1)));
	var overlapUnitKeysLength = pipe(converge(intersection, rhsUnitKeys, lhsUnitKeys), length);
	var lhsRhsKeysSetsContainNoSubOrSuperset = either(converge(equals, overlapUnitKeysLength, lhsUnitKeysLength), converge(equals, overlapUnitKeysLength, rhsUnitKeysLength));
	var needConversion = complement(lhsRhsKeysSetsContainNoSubOrSuperset);
	
	var mergeMultiplicationLhsUnitPairs = pipe(nthArg(0), toPairs);
	var mergeMultiplicationRhsUnitPairs = pipe(nthArg(1), toPairs);
	
	var mergeMultiplicationUnitSymbols = pipe(converge(concat, mergeMultiplicationLhsUnitPairs, mergeMultiplicationRhsUnitPairs), groupBy(head), mapObj(sumLastElementsInPairs), pickBy(notZero));
	
	var performMultiplyMath = function performMultiplyMath(direction, ctx, left, right) {
	  var byDirection = mapObj(multiply(direction));
	
	  var value = _extends({}, _typesDescriptors.entity, {
	    value: left.value * Math.pow(right.value, direction),
	    units: mergeMultiplicationUnitSymbols(left.units, byDirection(right.units)),
	    symbols: mergeMultiplicationUnitSymbols(left.symbols, byDirection(right.symbols))
	  });
	
	  // Remove all units without a type
	  return _typesEntity.resolveDimensionlessUnits(ctx, value);
	};
	
	var abstractMathMultiply = cond([[eitherValueNil, toNil], [lhsValueZero, toZeroEntity], [rhsIsZeroAndNotDivision, toZeroEntity], [needConversion, converge(performMultiplyMath, sign, context, lhsToSi, rhsToSi)], [T, performMultiplyMath]]);
	
	var performExponentMath = function performExponentMath(direction, ctx, left, right) {
	  var byExponent = mapObj(multiply(right.value));
	
	  return _extends({}, _typesDescriptors.entity, {
	    value: Math.pow(left.value, right.value * direction),
	    units: byExponent(left.units),
	    symbols: byExponent(left.symbols)
	  });
	};
	
	var abstractMathExponent = cond([[eitherValueNil, toNil], [rhsNotPureNumericEntity, toNil], [T, performExponentMath]]);
	
	var valueAdd = partial(abstractMathAdd, 1);
	var valueSubtract = partial(abstractMathAdd, -1);
	var valueMultiply = partial(abstractMathMultiply, 1);
	var valueDivide = partial(abstractMathMultiply, -1);
	var valueExponent = partial(abstractMathExponent, 1);
	// No inverse exponent
	
	exports.add = valueAdd;
	exports.subtract = valueSubtract;
	exports.multiply = valueMultiply;
	exports.divide = valueDivide;
	exports.exponent = valueExponent;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(101), __webpack_require__(80), __webpack_require__(41), __webpack_require__(27), __webpack_require__(16), __webpack_require__(77), __webpack_require__(37), __webpack_require__(53), __webpack_require__(122), __webpack_require__(61), __webpack_require__(60), __webpack_require__(160), __webpack_require__(36), __webpack_require__(45), __webpack_require__(99), __webpack_require__(162), __webpack_require__(166), __webpack_require__(113), __webpack_require__(114), __webpack_require__(167), __webpack_require__(168), __webpack_require__(49), __webpack_require__(169), __webpack_require__(137), __webpack_require__(65), __webpack_require__(47), __webpack_require__(39), __webpack_require__(148), __webpack_require__(81)))

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * A function wrapping calls to the two functions in an `||` operation, returning the result of the first
	 * function if it is truth-y and the result of the second function otherwise.  Note that this is
	 * short-circuited, meaning that the second function will not be invoked if the first returns a truth-y
	 * value.
	 *
	 * @func
	 * @memberOf R
	 * @category Logic
	 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	 * @param {Function} f a predicate
	 * @param {Function} g another predicate
	 * @return {Function} a function that applies its arguments to `f` and `g` and `||`s their outputs together.
	 * @see R.or
	 * @example
	 *
	 *      var gt10 = function(x) { return x > 10; };
	 *      var even = function(x) { return x % 2 === 0 };
	 *      var f = R.either(gt10, even);
	 *      f(101); //=> true
	 *      f(8); //=> true
	 */
	module.exports = _curry2(function either(f, g) {
	  return function _either() {
	    return f.apply(this, arguments) || g.apply(this, arguments);
	  };
	});


/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * A function wrapping calls to the two functions in an `&&` operation, returning the result of the first
	 * function if it is false-y and the result of the second function otherwise.  Note that this is
	 * short-circuited, meaning that the second function will not be invoked if the first returns a false-y
	 * value.
	 *
	 * @func
	 * @memberOf R
	 * @category Logic
	 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
	 * @param {Function} f a predicate
	 * @param {Function} g another predicate
	 * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
	 * @see R.and
	 * @example
	 *
	 *      var gt10 = function(x) { return x > 10; };
	 *      var even = function(x) { return x % 2 === 0 };
	 *      var f = R.both(gt10, even);
	 *      f(100); //=> true
	 *      f(101); //=> false
	 */
	module.exports = _curry2(function both(f, g) {
	  return function _both() {
	    return f.apply(this, arguments) && g.apply(this, arguments);
	  };
	});


/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	var _contains = __webpack_require__(144);
	var _curry2 = __webpack_require__(6);
	var _filter = __webpack_require__(58);
	var flip = __webpack_require__(111);
	var uniq = __webpack_require__(127);
	
	
	/**
	 * Combines two lists into a set (i.e. no duplicates) composed of those elements common to both lists.
	 *
	 * @func
	 * @memberOf R
	 * @category Relation
	 * @sig [a] -> [a] -> [a]
	 * @param {Array} list1 The first list.
	 * @param {Array} list2 The second list.
	 * @see R.intersectionWith
	 * @return {Array} The list of elements found in both `list1` and `list2`.
	 * @example
	 *
	 *      R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
	 */
	module.exports = _curry2(function intersection(list1, list2) {
	  return uniq(_filter(flip(_contains)(list1), list2));
	});


/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	var _concat = __webpack_require__(14);
	var _curry2 = __webpack_require__(6);
	var _hasMethod = __webpack_require__(15);
	var _isArray = __webpack_require__(12);
	
	
	/**
	 * Returns a new list consisting of the elements of the first list followed by the elements
	 * of the second.
	 *
	 * @func
	 * @memberOf R
	 * @category List
	 * @sig [a] -> [a] -> [a]
	 * @param {Array} list1 The first list to merge.
	 * @param {Array} list2 The second set to merge.
	 * @return {Array} A new array consisting of the contents of `list1` followed by the
	 *         contents of `list2`. If, instead of an Array for `list1`, you pass an
	 *         object with a `concat` method on it, `concat` will call `list1.concat`
	 *         and pass it the value of `list2`.
	 *
	 * @example
	 *
	 *      R.concat([], []); //=> []
	 *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
	 *      R.concat('ABC', 'DEF'); // 'ABCDEF'
	 */
	module.exports = _curry2(function concat(set1, set2) {
	  if (_isArray(set2)) {
	    return _concat(set1, set2);
	  } else if (_hasMethod('concat', set1)) {
	    return set1.concat(set2);
	  } else {
	    throw new TypeError("can't concat " + typeof set1);
	  }
	});


/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(intersection, keys, pick, equals, nthArg, prop, pipe, length, isEmpty, either, converge, lt, cond, ifElse, T, path) {'use strict';
	
	exports.__esModule = true;
	exports['default'] = combineValues;
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _typesEntity = __webpack_require__(141);
	
	var _mathEntity = __webpack_require__(165);
	
	var entityMath = _interopRequireWildcard(_mathEntity);
	
	function shouldDivideDimensions(lhsDimensions, rhsDimensions) {
	  var overlap = intersection(keys(lhsDimensions), keys(rhsDimensions));
	  var onlyOverlap = pick(overlap);
	
	  return overlap.length > 0 && equals(onlyOverlap(lhsDimensions), onlyOverlap(rhsDimensions));
	}
	
	var lhs = nthArg(1);
	var rhs = nthArg(2);
	
	var units = prop('units');
	var unitsLength = pipe(units, length);
	var baseDimensionsEmpty = pipe(_typesEntity.baseDimensions, keys, isEmpty);
	
	var eitherBaseDimensionsEmpty = either(pipe(lhs, baseDimensionsEmpty), pipe(rhs, baseDimensionsEmpty));
	var unitsEqual = converge(equals, pipe(lhs, units), pipe(rhs, units));
	var baseDimensionsEqual = converge(equals, pipe(lhs, _typesEntity.baseDimensions), pipe(rhs, _typesEntity.baseDimensions));
	var shouldDivide = converge(shouldDivideDimensions, pipe(lhs, _typesEntity.dimensions), pipe(rhs, _typesEntity.dimensions));
	var lhsUnitsLengthLessThanRhsUnitsLength = converge(lt, pipe(lhs, unitsLength), pipe(rhs, unitsLength));
	
	var combineEntities = cond([
	// Unitless values multiply: `2 sin(...)` etc
	[eitherBaseDimensionsEmpty, entityMath.multiply],
	// 5cm by 40cm should be multiplied and not added (as would happen below)
	[unitsEqual, entityMath.multiply],
	// If the dimensions are equal, either convert or add (unless unitless)
	// I.e. `3 feet 5 inches` needs to be added
	[baseDimensionsEqual, entityMath.add],
	// Divide the statement with the most units by the unit with the least
	// I.e. `$5 at $3 per kilo` gives the same answer as `$3 per kilo using $5`
	[shouldDivide, ifElse(lhsUnitsLengthLessThanRhsUnitsLength, entityMath.divide, function (ctx, a, b) {
	  return entityMath.divide(ctx, b, a);
	})],
	// No idea, just mulitply
	[T, entityMath.multiply]]);
	
	var combineValueMap = {
	  'ENTITY': {
	    'ENTITY': combineEntities
	  }
	};
	
	function combineValues(context, a, b) {
	  var fn = path([a.type, b.type], combineValueMap);
	  return fn ? fn(context, a, b) : null;
	}
	
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(168), __webpack_require__(45), __webpack_require__(171), __webpack_require__(41), __webpack_require__(160), __webpack_require__(36), __webpack_require__(27), __webpack_require__(99), __webpack_require__(80), __webpack_require__(166), __webpack_require__(162), __webpack_require__(172), __webpack_require__(113), __webpack_require__(112), __webpack_require__(114), __webpack_require__(164)))

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Returns a partial copy of an object containing only the keys specified.  If the key does not exist, the
	 * property is ignored.
	 *
	 * @func
	 * @memberOf R
	 * @category Object
	 * @sig [k] -> {k: v} -> {k: v}
	 * @param {Array} names an array of String property names to copy onto a new object
	 * @param {Object} obj The object to copy from
	 * @return {Object} A new object with only properties from `names` on it.
	 * @see R.omit
	 * @example
	 *
	 *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
	 *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
	 */
	module.exports = _curry2(function pick(names, obj) {
	  var result = {};
	  var idx = 0;
	  while (idx < names.length) {
	    if (names[idx] in obj) {
	      result[names[idx]] = obj[names[idx]];
	    }
	    idx += 1;
	  }
	  return result;
	});


/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	var _curry2 = __webpack_require__(6);
	
	
	/**
	 * Returns `true` if the first argument is less than the second;
	 * `false` otherwise.
	 *
	 * @func
	 * @memberOf R
	 * @category Relation
	 * @sig Ord a => a -> a -> Boolean
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 * @see R.gt
	 * @example
	 *
	 *      R.lt(2, 1); //=> false
	 *      R.lt(2, 2); //=> false
	 *      R.lt(2, 3); //=> true
	 *      R.lt('a', 'z'); //=> true
	 *      R.lt('z', 'a'); //=> false
	 */
	module.exports = _curry2(function lt(a, b) { return a < b; });


/***/ }
/******/ ])
});
;
//# sourceMappingURL=recora.js.map