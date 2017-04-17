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
        this.index = 0;
        this.config = {
            activationFunction: '',
            neuronsCount: 0
        };
        this.neurons = [];

        this._initialize(options);
    }

    /**
     * Initialize the layer with options value given, if not, use the default value configured.
     * @param {object} options Options to initialize the layer
     * @param {number} options.index The index of the layer
     * @param {string} [options.activationFunction = 'SIGMOID'] The name of the activation function used to normalize result in each neuron
     * @param {number} [options.neuronsCount = 10] The number of neuron pushed in the layer
     * @private
     */
    _initialize(options) {
        options = Object.assign({
            activationFunction: utils.activationFunction.SIGMOID,
            neuronsCount: 10
        }, options);

        this._validateOrThrow(options);

        this.id = uuid.v4();
        this.index = options.index;
        this.config.activationFunction = options.activationFunction;
        this.config.neuronsCount = options.neuronsCount;

        this.neurons.push(...Array.from({ length: options.neuronsCount }).map(() => new Neuron({
            activationFunction: options.activationFunction
        })));
    }

    /**
     * Valid layer options before it's used to initialize the layer config. Throw the options value isn't expected.
     * @param {object} options Options to initialize the layer
     * @param {number} options.index The index of the layer
     * @param {string} options.activationFunction The name of the activation function used to normalize result in the neuron
     * @param {number} options.neuronsCount The name of the activation function used to normalize result in a neuron
     * @private
     */
    _validateOrThrow(options) {
        if (!Object.keys(utils.activationFunction).includes(options.activationFunction)) {
            throw new Error('The activationFunction must be in the utils.activationFunction.');
        }
        if (typeof options.index !== 'number') throw new Error('The index must be a number.');
        if (typeof options.neuronsCount !== 'number') throw new Error('The neuronsCount must be a number.');
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
     * Compute output value for each neuron of the layer.
     * @param {Array} values Array of number or neurons
     * @returns {Array}
     */
    compute(values) {
        if (this.index === 0) {
            /* Input are number in the case of input layer computation */
            return this.neurons.map(neuron => neuron.compute(values));
        } else {
            /* Input are neuron in the case of other layer */
            return this.neurons.map(neuron => neuron.compute(values.map(inputNeuron => {
                return neuron.inputNeuronIds.includes(inputNeuron.id) && inputNeuron.outputValue;
            })));
        }
    }

    /**
     * Export the object to json format.
     * @returns {{id: *, config: ({activationFunction: string, neuronsCount: number, learningRate: number, error: number}|*), neurons: Array}}
     */
    toJSON() {
        return {
            id: this.id,
            index: this.index,
            config: this.config,
            neurons: this.neurons.map(n => n.toJSON())
        };
    }
}
