import uuid from 'uuid'

import Layer from './layer';

/**
 * @class Network
 * @description Network object than contains all layers, with minimum two layers (input and output).
 */
export default class Network {
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
        if (!options.autoPopulateLayer && !options.layers.length < 2) throw new Error('The network waiting for 2 layers minimum (input, output).')
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