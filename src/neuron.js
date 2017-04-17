import uuid from 'uuid';

import utils from './utils';

/**
 * @class Neuron
 * @description
 */
export default class Neuron {
    constructor(options = {}) {
        this.id = null;
        this.config = {
            activationFunction: '',
            weight: null,
            bias: null
        };
        this.inputNeuronIds = [];
        this.outputNeuronIds = [];
        this.outputValue = null;

        this._initialize(options);
    }

    /**
     * Initialize the neuron with options value given, if not, use the default value configured.
     * @param {object} options Options to initialize the neuron
     * @param {string} [options.activationFunction = 'SIGMOID'] The name of the activation function used to normalize result
     * @private
     */
    _initialize(options) {
        options = Object.assign({
            activationFunction: utils.activationFunction.SIGMOID
        }, options);

        this.id = uuid.v4();
        this.config.activationFunction = options.activationFunction;
        this.config.weight = Math.random();
        this.config.bias = Math.random() * .2 - .1;
    }

    /**
     * Add new id of the input neuron link to the actual neuron.
     * @param {string} id The id of the input neuron link to the actual neuron
     */
    addInputNeuronId(id) {
        this.inputNeuronIds.push(id);
    }

    /**
     * Add new id of the output neuron link to the actual neuron.
     * @param {string} id The id of the output neuron link to the actual neuron
     */
    addOutputNeuronId(id) {
        this.outputNeuronIds.push(id);
    }

    /**
     * Compute the output result.
     * @param {number} input Value used to compute the output result
     * @returns {number}
     */
    compute(input = 0) {
        const result = input * this.weight + this.bias;
        const normalizedResult = this.normalize(result);
        this.outputValue = normalizedResult;
        return this.outputValue;
    }

    /**
     * Normalize the result and return a value between [0 - 1].
     * @param value The value to normalize
     * @returns {number}
     */
    normalize(value) {
        switch (this.config.activationFunction) {
            case 'SIGMOID':
                return (1 - (Math.pow(Math.E, -value)));
            default:
                throw new Error(`The activationFunction ${this.config.activationFunction} isn't implemented yet.`);
        }
    }

    /**
     * Export the object to json format.
     * @returns {{id: *, config: ({activationFunction: string, weight: null, bias: null}|*), inputNeuronIds: Array, outputNeuronIds: Array, outputValue: (null|number|*)}}
     */
    toJSON() {
        return {
            id: this.id,
            config: this.config,
            inputNeuronIds: this.inputNeuronIds,
            outputNeuronIds: this.outputNeuronIds,
            outputValue: this.outputValue
        };
    }
}
