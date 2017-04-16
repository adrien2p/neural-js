(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("neural-js", [], factory);
	else if(typeof exports === 'object')
		exports["neural-js"] = factory();
	else
		root["neural-js"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(7);
var v4 = __webpack_require__(8);

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = __webpack_require__(0);

var _uuid2 = _interopRequireDefault(_uuid);

var _neuron = __webpack_require__(2);

var _neuron2 = _interopRequireDefault(_neuron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Layer
 * @description Layer object than contains all neurons.
 */
var Layer = function () {
    function Layer() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Layer);

        this.id = _uuid2.default.v4();
        this.metadata = {};
        this.neurons = [];

        this._init(options);
    }

    /**
     * Initialize layer with neurons pass in options or auto generated.
     * @param {object} options Parameters
     * @param {boolean} [options.autoPopulateNeurons = true]  If it's true, generate 10 neurons according to the next parameter
     * @param {number} [options.size = 10] The maximum number of neurons in the layer
     * @param {Array} [options.neurons = null] All the neurons to add in the layer
     * @param {string} [options.activationFunction = 'sigmoid'] The layer activation function
     * @private
     */


    _createClass(Layer, [{
        key: '_init',
        value: function _init(options) {
            options = Object.assign({
                activationFunction: 'sigmoid',
                autoPopulateNeurons: true,
                size: 10,
                neurons: null
            }, options);

            this._validateOrThrow(options);
            this.metadata.options = options;

            if (options.autoPopulateNeurons) {
                this.neurons = Array.from({ length: options.size }).map(function () {
                    return new _neuron2.default({
                        activationFunction: options.activationFunction
                    });
                });
            } else {
                var _neurons;

                (_neurons = this.neurons).push.apply(_neurons, _toConsumableArray(options.neurons));
            }
        }

        /**
         * Validate options object and throw if a value doesn't respect a condition.
         * @param {object} options Parameters to validate
         * @param {boolean} options.autoPopulateNeurons If it's true, generate 10 neurons according to the next parameter
         * @param {number} options.size The maximum number of neurons in the layer
         * @param {Array} options.neurons All the neurons to add in the layer
         * @param {string} options.activationFunction The layer activation function
         * @private
         */

    }, {
        key: '_validateOrThrow',
        value: function _validateOrThrow(options) {
            if (typeof options.autoPopulateNeurons !== 'boolean') throw new Error('autoPopulateNeurons must be a boolean.');
            if (typeof options.size !== 'number') throw new Error('size must be a number.');
            if (typeof options.activationFunction !== 'string') throw new Error('activationFunction must be a string.');
            if (!options.autoPopulateNeurons && !Array.isArray(options.neurons)) throw new Error('neurons must be an array.');
        }

        /**
         * Add new input connection on each neuron of the new layer and output connection on each neuron contains in the actual layer.
         * @param {Layer} nextLayer The layer on
         */

    }, {
        key: 'connectInputOutputNeurons',
        value: function connectInputOutputNeurons(nextLayer) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.neurons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var neuron = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = nextLayer.neurons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var nextLayerNeuron = _step2.value;

                            !neuron.metadata.inputNeuronIds.includes(nextLayer.id) && neuron.addOutputNeuronId(nextLayerNeuron.id);
                            !nextLayerNeuron.metadata.outputNeuronIds.includes(neuron.id) && nextLayerNeuron.addInputNeuronId(neuron.id);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'resolve',
        value: function resolve(input) {
            return this.neurons.map(function (neuron, i) {
                return neuron.process(input[i]);
            });
        }

        /**
         * Return the layer as a json object.
         * @returns {{id: *, metadata: ({}|*), neurons: Array}}
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                id: this.id,
                metadata: this.metadata,
                neurons: this.neurons.map(function (n) {
                    return n.toJSON();
                })
            };
        }
    }]);

    return Layer;
}();

exports.default = Layer;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = __webpack_require__(0);

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Neuron
 * @description Neuron object than contains weight, bias, ... information to compute the prediction.
 */
var Neuron = function () {
    function Neuron() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { activationFunction: 'sigmoid' };

        _classCallCheck(this, Neuron);

        this.id = _uuid2.default.v4();
        this.metadata = {
            inputNeuronIds: [],
            outputNeuronIds: []
        };
        this.weight = Math.random();
        this.bias = 1;
        this.activationFunction = options.activationFunction;
        this.lastComputedOutput = null;
    }

    /**
     * Add the id of the input neuron.
     * @param {number} id The id of the neuron
     */


    _createClass(Neuron, [{
        key: 'addInputNeuronId',
        value: function addInputNeuronId(id) {
            this.metadata.inputNeuronIds.push(id);
        }

        /**
         * Add the id of the output neuron.
         * @param {number} id The id of the neuron
         */

    }, {
        key: 'addOutputNeuronId',
        value: function addOutputNeuronId(id) {
            this.metadata.outputNeuronIds.push(id);
        }

        /**
         * Compute de output value.
         * @param {Array} inputs All inputs value
         * @returns {number}
         */

    }, {
        key: 'process',
        value: function process(input) {
            var result = input * this.weight;
            var normalizedResult = this.normalize(result);
            this.lastComputedOutput = normalizedResult;
            return this.lastComputedOutput;
        }
    }, {
        key: 'normalize',
        value: function normalize(value) {
            switch (this.activationFunction) {
                case 'sigmoid':
                    return 1 - Math.pow(Math.E, -value);
                default:
                    throw new Error('The activationFunction ' + this.activationFunction + ' isn\'t implemented.');
            }
        }

        /**
         * Return the layer as a json object.
         * @returns {{id: *, metadata: ({}|*), weight: *, bias: *, inputNeuronIds: Array, outputNeuronIds: *}}
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                id: this.id,
                metadata: this.metadata,
                weight: this.weight,
                bias: this.bias
            };
        }
    }]);

    return Neuron;
}();

exports.default = Neuron;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _neuron = __webpack_require__(2);

var _neuron2 = _interopRequireDefault(_neuron);

var _layer = __webpack_require__(1);

var _layer2 = _interopRequireDefault(_layer);

var _network = __webpack_require__(6);

var _network2 = _interopRequireDefault(_network);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { Network: _network2.default, Layer: _layer2.default, Neuron: _neuron2.default };
module.exports = exports['default'];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = __webpack_require__(0);

var _uuid2 = _interopRequireDefault(_uuid);

var _layer = __webpack_require__(1);

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Network
 * @description Network object than contains all layers, with minimum two layers (input and output).
 */
var Network = function () {
    function Network() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Network);

        this.id = _uuid2.default.v4();
        this.metadata = {};
        this.layers = [];

        this._init(options);
    }

    /**
     * Initialize the network with layers pass in options or auto generated.
     * @param {object} options Parameters
     * @param {string} [options.activationFunction = 'sigmoid'] The layer activation function
     * @param {boolean} [options.autoPopulateLayer = true]  If it's true, generate 3 layers (input, hidden, output)
     * @param {number} [options.layers = []] The layers pass to populate the network
     * @private
     */


    _createClass(Network, [{
        key: '_init',
        value: function _init(options) {
            var _this = this;

            options = Object.assign({
                activationFunction: 'sigmoid',
                autoPopulateLayer: true,
                layers: null
            }, options);

            this._validateOrThrow(options);
            this.metadata.options = options;

            if (options.autoPopulateLayer) {
                var inputLayer = new _layer2.default({ size: 100, activationFunction: options.activationFunction });
                var hiddenLayer = new _layer2.default({ size: 10, activationFunction: options.activationFunction });
                var outputLayer = new _layer2.default({ size: 1, activationFunction: options.activationFunction });

                this.layers.push(inputLayer, hiddenLayer, outputLayer);
                this.layers.map(function (layer, i) {
                    return i < _this.layers.length - 1 && layer.connectInputOutputNeurons(_this.layers[i + 1]);
                });
            } else {
                var _layers;

                (_layers = this.layers).push.apply(_layers, _toConsumableArray(options.layers));
            }
        }

        /**
         * Validate options object and throw if a value doesn't respect a condition.
         * @param {object} options Parameters
         * @param {boolean} options.autoPopulateLayer  If it's true, generate 3 layers (input, hidden, output)
         * @param {number} options.layers The layers pass to populate the network
         * @param {string} options.activationFunction The layer activation function
         * @private
         */

    }, {
        key: '_validateOrThrow',
        value: function _validateOrThrow(options) {
            if (typeof options.autoPopulateLayer !== 'boolean') throw new Error('autoPopulateLayer must be a boolean.');
            if (typeof options.activationFunction !== 'string') throw new Error('activationFunction must be a string.');
            if (!options.autoPopulateLayer && !Array.isArray(options.layers)) throw new Error('layers must be an array.');
            if (!options.autoPopulateLayer && !options.layers.length < 2) throw new Error('The network waiting for 2 layers minimum (input, output).');
        }

        /**
         *
         * @param data
         */

    }, {
        key: 'train',
        value: function train(set) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            options = Object.assign({
                learningRate: 0.1,
                iterations: 10000,
                error: 0.005,
                log: false
            }, options);

            var layersCopy = Array.from(this.layers);
            var inputLayer = layersCopy.reverse().pop();
            //const outputLayer = layersCopy.reverse().pop();
            //const hiddenLayers = [].concat(...layersCopy);

            var iteration = 0;
            var error = 1;

            while (iteration <= options.iterations || error > options.error) {
                iteration++;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = set[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var data = _step.value;

                        var input = data.input;
                        inputLayer.resolve(input);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }
    }, {
        key: 'propagate',
        value: function propagate() {}

        /**
         * Return the network as json object.
         * @returns {{id: *, metadata: ({}|*), layers: Array}}
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                id: this.id,
                metadata: this.metadata,
                layers: this.layers.map(function (l) {
                    return l.toJSON();
                }),
                activationFunction: this.activationFunction
            };
        }
    }]);

    return Network;
}();

exports.default = Network;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var rng = __webpack_require__(4);
var bytesToUuid = __webpack_require__(3);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(4);
var bytesToUuid = __webpack_require__(3);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ })
/******/ ]);
});
//# sourceMappingURL=neural-js.js.map