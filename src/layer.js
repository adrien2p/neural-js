import uuid from 'uuid';

import utils from './utils';
import Neuron from './neuron';

/**
 * @class Layer
 * @description
 */
export default class Layer {
    constructor(options = {}) {
        this.id = null;
        this.config = {
            activationFunction: '',
            neuronsCount: 0,
            learningRate: 0,
            error: 0
        };
        this.neurons = [];

        this._initialize(options);
    }

    /**
     * Initialize the layer with options value given, if not, use the default value configured.
     * @param {object} options Options to initialize the layer
     * @param {string} [options.activationFunction = 'SIGMOID'] The name of the activation function used to normalize result in each neuron
     * @param {number} [options.neuronsCount = 10] The number of neuron pushed in the layer
     * @param {number} [options.learningRate = 0.1] The value used to compute the output value in each neuron
     * @param {number} [options.error = 0.005] The maximum error value to reach
     * @private
     */
    _initialize(options) {
        options = Object.assign({
            activationFunction: utils.activationFunction.SIGMOID,
            neuronsCount: 10,
            learningRate: 0.1,
            error: 0.005
        }, options);

        this._validateOrThrow(options);

        this.id = uuid.v4();
        this.config.activationFunction = options.activationFunction;
        this.config.neuronsCount = options.neuronsCount;
        this.config.learningRate = options.learningRate;
        this.config.error = options.error;

        this.neurons.push(...Array.from({ length: options.neuronsCount }).map(() => new Neuron({
            activationFunction: options.activationFunction
        })));
    }

    /**
     * Valid layer options before it's used to initialize the layer config. Throw the options value isn't expected.
     * @param {object} options Options to initialize the layer
     * @param {string} ptions.activationFunction The name of the activation function used to normalize result in the neuron
     * @param {number} options.neuronsCount The name of the activation function used to normalize result in a neuron
     * @param {number} options.learningRate The value used to compute the output value in a neuron
     * @param {number} options.error The maximum error value to reach
     * @private
     */
    _validateOrThrow(options) {
        if (!Object.keys(utils.activationFunction).includes(options.activationFunction)) {
            throw new Error('The activationFunction must be in the utils.activationFunction.');
        }
        if (typeof options.neuronsCount !== 'number') throw new Error('The neuronsCount must be a number.');
        if (typeof options.learningRate !== 'number') throw new Error('The learningRate must be a number.');
        if (typeof options.error !== 'number') throw new Error('The error must be a number.');
    }

    /**
     * Add all ids of each input neuron of the layer for each neuron of the next layer.
     * Add all ids of each nextLayer neuron for each neuron of the layer.
     * @param {Layer} nextLayer
     */
    fillInputOutputNeuronIds(nextLayer) {
        for (const neuron of this.neurons) {
            for (const nextLayerNeuron of nextLayer.neurons) {
                !neuron.inputNeuronIds.includes(nextLayer.id) && neuron.addOutputNeuronId(nextLayerNeuron.id);
                !nextLayerNeuron.outputNeuronIds.includes(neuron.id) && nextLayerNeuron.addInputNeuronId(neuron.id);
            }
        }
    }

    /**
     * Active all neuron to compute their output value.
     * @param {Array} inputs Array of number value
     * @returns {Array}
     */
    compute(inputs) {
        return this.neurons.map((neuron, i) => neuron.compute(inputs[i]));
    }

    /**
     * Export the object to json format.
     * @returns {{id: *, config: ({activationFunction: string, neuronsCount: number, learningRate: number, error: number}|*), neurons: Array}}
     */
    toJSON() {
        return {
            id: this.id,
            config: this.config,
            neurons: this.neurons.map(n => n.toJSON())
        };
    }
}
