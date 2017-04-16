import uuid from 'uuid';

/**
 * @class Neuron
 * @description Neuron object than contains weight, bias, ... information to compute the prediction.
 */
export default class Neuron {
    constructor(options = { activationFunction: 'sigmoid' }) {
        this.id = uuid.v4();
        this.metadata = {};
        this.weight = Math.random();
        this.bias = 1;
        this.inputNeuronIds = [];
        this.outputNeuronIds = [];
        this.activationFunction = options.activationFunction;
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

    /**
     * Compute de output value.
     * @param {Array} inputs All inputs value
     * @returns {number}
     */
    process(input) {
        const result = input * this.weight;
        const normalizedResult = this.normalize(result);
        this.lastProcessResult = normalizedResult;
        return this.lastProcessResult;
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
            outputNeuronIds: this.outputNeuronIds
        };
    }
}