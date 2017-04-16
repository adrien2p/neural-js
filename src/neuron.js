import uuid from 'uuid';

/**
 * @class Neuron
 * @description Neuron object than contains weight, bias, ... information to compute the prediction.
 */
export default class Neuron {
    constructor(options = { activationFunction: 'sigmoid' }) {
        this.id = uuid.v4();
        this.metadata = {
            inputNeuronIds: [],
            outputNeuronIds: []
        };
        this.weight = Math.random();
        this.bias = Math.random() * .2 - .1;
        this.outputValue = null;
        this.activationFunction = options.activationFunction;
    }

    /**
     * Add the id of the input neuron.
     * @param {number} id The id of the neuron
     */
    addInputNeuronId(id) {
        this.metadata.inputNeuronIds.push(id);
    }

    /**
     * Add the id of the output neuron.
     * @param {number} id The id of the neuron
     */
    addOutputNeuronId(id) {
        this.metadata.outputNeuronIds.push(id);
    }

    /**
     * Compute de output value.
     * @param {Array} inputs All inputs value
     * @returns {number}
     */
    process(input = null) {
        const result = input * this.weight + this.bias;
        const normalizedResult = this.normalize(result);
        this.outputValue = normalizedResult;
        return this.outputValue;
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
     * @returns {{id: *, metadata: *, weight: *, bias: number, outputValue: (null|*)}}
     */
    toJSON() {
        return {
            id: this.id,
            metadata: this.metadata,
            weight: this.weight,
            bias: this.bias,
            outputValue: this.outputValue
        };
    }
}
