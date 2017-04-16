import uuid from 'uuid';

import Neuron from './neuron';

/**
 * @class Layer
 * @description Layer object than contains all neurons.
 */
export default class Layer {
    constructor(options = {}) {
        this.id = uuid.v4();
        this.metadata = {};
        this.neurons = [];

        this._init(options);
    }

    /**
     * Initialize layer with neurons pass in options or auto generated.
     * @param {object} options Parameters
     * @param {number} [options.size = 10] The maximum number of neurons in the layer
     * @param {Array} [options.neurons = null] All the neurons to add in the layer
     * @param {string} [options.activationFunction = 'sigmoid'] The layer activation function
     * @private
     */
    _init(options) {
        options = Object.assign({
            activationFunction: 'sigmoid',
            size: 10,
            neurons: null
        }, options);

        this._validateOrThrow(options);
        this.metadata = {
            activationFunction: options.activationFunction,
            size: (options.neurons && options.neurons.length) || 10
        };

        if (!options.neurons) {
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
     * @param {number} options.size The maximum number of neurons in the layer
     * @param {Array} options.neurons All the neurons to add in the layer
     * @param {string} options.activationFunction The layer activation function
     * @private
     */
    _validateOrThrow(options) {
        if (typeof options.size !== 'number') throw new Error('size must be a number.');
        if (typeof options.activationFunction !== 'string') throw new Error('activationFunction must be a string.');
        if (options.neurons && !Array.isArray(options.neurons)) throw new Error('neurons must be an array.');
    }

    /**
     * Add new input connection on each neuron of the new layer and output connection on each neuron contains in the actual layer.
     * @param {Layer} nextLayer The layer on
     */
    connectInputOutputNeurons(nextLayer) {
        for (const neuron of this.neurons) {
            for (const nextLayerNeuron of nextLayer.neurons) {
                !neuron.metadata.inputNeuronIds.includes(nextLayer.id) && neuron.addOutputNeuronId(nextLayerNeuron.id);
                !nextLayerNeuron.metadata.outputNeuronIds.includes(neuron.id) && nextLayerNeuron.addInputNeuronId(neuron.id);
            }
        }
    }

    resolve(input) {
        return this.neurons.map((neuron, i) => neuron.process(input[i]));
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
