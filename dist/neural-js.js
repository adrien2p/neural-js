(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('neural-js', factory) :
	(global['neural-js'] = factory());
}(this, (function () { 'use strict';

var v1 = require('./v1');
var v4$1 = require('./v4');

var uuid = v4$1;
uuid.v1 = v1;
uuid.v4 = v4$1;

module.exports = uuid;

class Neuron {
    constructor() {
        this.id = v4();
        this.weight = Math.random();
        this.bias = Math.random();
        this.inputConnections = {};
        this.outputConnections = {};
        this.belongsTo = null;
    }
}

class Layer {}

var neuralJs = { Neuron, Layer };

return neuralJs;

})));
