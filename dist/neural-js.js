(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('uuid')) :
	typeof define === 'function' && define.amd ? define('neural-js', ['uuid'], factory) :
	(global['neural-js'] = factory(global.uuid));
}(this, (function (uuid) { 'use strict';

uuid = 'default' in uuid ? uuid['default'] : uuid;

/**
 * @class Neuron
 * @description Neuron object than contains weight, bias, ... information to compute the prediction.
 */
class Neuron {
    constructor(options = {}) {
        this.id = uuid.v4();
        this.metadata = {};
        this.weight = Math.random();
        this.bias = 1;
        this.inputNeuronIds = [];
        this.outputNeuronIds = [];
        this.activationFunction = options.activationFunction || 'sigmoid';
        this.processCount = 0;
        this.lastProcessResult = null;
    }

    /**
     * Add the id of the input neuron.
     * @param {number} id The id of the neuron
     */
    addInputNeuronId(id) {
        this.inputNeuronIds.push(id);
    }

    /**
     * Add the id of the output neuron.
     * @param {number} id The id of the neuron
     */
    addOutputNeuronId(id) {
        this.outputNeuronIds.push(id);
    }

    process(inputs) {
        this.processCount++;

        let output = 0;
        for (const input of inputs) {
            output += input * this.weight;
        }
        output += this.bias * this.weight;

        this.lastProcessResult = this.normalize(output);
        return this.lastProcessResult;
    }

    train(set, options) {
        let result = null;
        for (const data of set) {
            result = this.process(data.input);
        }
        return result;
    }

    normalize(value) {
        switch (this.activationFunction) {
        case 'sigmoid':
            return (1 - (Math.pow(Math.E, -value)));
        default:
            throw new Error(`The activationFunction ${this.activationFunction} isn't implemented.`);
        }
    }

    /**
     * Return the layer as a json object.
     * @returns {{id: *, metadata: ({}|*), weight: *, bias: *, inputNeuronIds: Array, outputNeuronIds: *}}
     */
    toJSON() {
        return {
            id: this.id,
            metadata: this.metadata,
            weight: this.weight,
            bias: this.bias,
            inputNeuronIds: this.inputNeuronIds,
            outputNeuronIds: this.outputNeuronIds,
            activationFunction: this.activationFunction,
            processCount: this.processCount,
            lastProcessResult: this.lastProcessResult
        };
    }
}

/**
 * @class Layer
 * @description Layer object than contains all neurons.
 */
class Layer {
    constructor(options = {}) {
        this.id = uuid.v4();
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
     * @param {string} [options.activationFunction = 'sigmoid'] The neuron activation function
     * @private
     */
    _init(options) {
        options = Object.assign({
            autoPopulateNeurons: true,
            size: 10,
            neurons: null,
            activationFunction: 'sigmoid'
        }, options);

        this._validateOrThrow(options);
        this.metadata.options = options;

        if (options.autoPopulateNeurons) {
            this.neurons = Array.from({ length: options.size }).map(() => new Neuron({
                activationFunction: options.activationFunction
            }));
        } else {
            this.neurons.push(...options.neurons);
        }
    }

    /**
     * Validate options object and throw if a value doesn't respect a condition.
     * @param {object} options Parameters to validate
     * @param {boolean} options.autoPopulateNeurons If it's true, generate 10 neurons according to the next parameter
     * @param {number} options.size The maximum number of neurons in the layer
     * @param {Array} options.neurons All the neurons to add in the layer
     * @param {string} options.activationFunction The neuron activation function
     * @private
     */
    _validateOrThrow(options) {
        if (typeof options.autoPopulateNeurons !== 'boolean') throw new Error('autoPopulateNeurons must be a boolean.');
        if (typeof options.size !== 'number') throw new Error('size must be a number.');
        if (!options.autoPopulateNeurons && !Array.isArray(options.neurons)) throw new Error('neurons must be an array.');
        if (typeof options.activationFunction !== 'string') throw new Error('activationFunction must be a string.');
    }

    /**
     * Add new input connection on each neuron of the new layer and output connection on each neuron contains in the actual layer.
     * @param {Layer} nextLayer The layer on
     */
    connectInputOutputNeurons(nextLayer) {
        for (const neuron of this.neurons) {
            for (const nextLayerNeuron of nextLayer.neurons) {
                neuron.addOutputNeuronId(nextLayerNeuron.id);
                nextLayerNeuron.addInputNeuronId(neuron.id);
            }
        }
    }

    trainNeurons(set, options) {
        for (const neuron of this.neurons) {
            neuron.train(set, options);
        }
    }

    /**
     * Return the layer as a json object.
     * @returns {{id: *, metadata: ({}|*), neurons: Array}}
     */
    toJSON() {
        return {
            id: this.id,
            metadata: this.metadata,
            neurons: this.neurons.map(n => n.toJSON())
        };
    }
}

/**
 * @class Network
 * @description Network object than contains all layers, with minimum two layers (input and output).
 */
class Network {
    constructor(options = {}) {
        this.id = uuid.v4();
        this.metadata = {};
        this.layers = [];

        this._init(options);
    }

    /**
     * Initialize the network with layers pass in options or auto generated.
     * @param {object} options Parameters
     * @param {boolean} [options.autoPopulateLayer = true]  If it's true, generate 3 layers (input, hidden, output)
     * @param {number} [options.layers = []] The layers pass to populate the network
     * @private
     */
    _init(options) {
        options = Object.assign({
            autoPopulateLayer: true,
            layers: null
        }, options);

        this._validateOrThrow(options);
        this.metadata.options = options;

        if (options.autoPopulateLayer) {
            const inputLayer = new Layer({ size: 100 });
            const hiddenLayer = new Layer({ size: 10 });
            const outputLayer = new Layer({ size: 1 });

            this.layers.push(inputLayer, hiddenLayer, outputLayer);
            this.layers.map((layer, i) => i < this.layers.length - 1 && layer.connectInputOutputNeurons(this.layers[i + 1]));
        } else {
            this.layers.push(...options.layers);
        }
    }

    /**
     * Validate options object and throw if a value doesn't respect a condition.
     * @param {object} options Parameters
     * @param {boolean} options.autoPopulateLayer  If it's true, generate 3 layers (input, hidden, output)
     * @param {number} options.layers The layers pass to populate the network
     * @private
     */
    _validateOrThrow(options) {
        if (typeof options.autoPopulateLayer !== 'boolean') throw new Error('autoPopulateLayer must be a boolean.');
        if (!options.autoPopulateLayer && !Array.isArray(options.layers)) throw new Error('layers must be an array.');
        if (!options.autoPopulateLayer && !options.layers.length < 2) throw new Error('The network waiting for 2 layers minimum (input, output).');
    }

    /**
     *
     * @param data
     */
    train(set, options = {}) {
        options = Object.assign({
            learningRate: 0.1,
            iterations: 10000,
            error: 0.005,
            log: false
        }, options);

        this.layers.trainNeurons(set, options);
    }

    /**
     * Return the network as json object.
     * @returns {{id: *, metadata: ({}|*), layers: Array}}
     */
    toJSON() {
        return {
            id: this.id,
            metadata: this.metadata,
            layers: this.layers.map(l => l.toJSON())
        };
    }
}

var neuralJs = { Network, Layer, Neuron };

return neuralJs;

})));
