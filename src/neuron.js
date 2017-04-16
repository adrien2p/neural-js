import * as uuid from 'uuid';

/**
 * @class Neuron
 * @description Neuron object than contains weight, bias, ... information to compute the prediction.
 */
export default class Neuron {
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
        }
    }
}