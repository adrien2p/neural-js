import uuid from 'uuid';
import utils from './utils';
import Layer from './Layer';

/**
 * @class Network
 * @description The network which will predict the result than you want computed.
 */
export default class Network {
    /**
     * @constructor
     * @param {object} options Options configuration
     * @param {string} [options.name = 'N/A'] The name of the network
     * @param {object} [options.layers]
     * @param {object} [options.layers.config] The layers configuration
     */
    constructor(options = {
        name: 'N/A',
        activationFunction: utils.activationFunction.SIGMOID,
        layers: {
            config: {
                input: 2,
                hidden: [5, 5],
                output: 1
            }
        }
    }) {
        this.id = uuid.v4();
        this.name = options.name;
        this.activationFunction = options.activationFunction;
        this.layers = {
            config: {
                input: options.layers.config.input || 3,
                hidden: options.layers.config.hidden || [2, 2],
                output: options.layers.config.output || 1
            },
            input: null,
            hidden: [],
            output: null
        };

        this.layers.input = new Layer({
            type: 'input',
            size: options.layers.config.input,
            activationFunction: options.activationFunction
        });

        this.layers.hidden = Array.from({ length: options.layers.config.hidden.length }).map((v, i) => {
            return new Layer({
                type: 'hidden',
                size: options.layers.config.hidden[i],
                activationFunction: options.activationFunction
            });
        });

        this.layers.output = new Layer({
            type: 'output',
            size: options.layers.config.output,
            activationFunction: options.activationFunction
        });

        this.layers.input.project(this.layers.hidden[0]);
        this.layers.hidden.map((layer, i) => {
            if (i < this.layers.hidden.length - 1) {
                layer.project(this.layers.hidden[i + 1]);
            } else {
                layer.project(this.layers.output);
            }
        });
    }

    /**
     * Take input values and predict the expected result.
     * @param {Array<number>} input The input values to predict
     * @returns {Array<number>}
     */
    activate(input) {
        this.layers.input.activate(input);
        for (const hiddenLayer of this.layers.hidden) {
            hiddenLayer.activate();
        }

        return this.layers.output.activate();
    }

    propagate(learningRate, expected) {
        this.layers.output.propagate(learningRate, expected);

        const hiddenLayersCopy = Array.from(this.layers.hidden);
        (hiddenLayersCopy.reverse()).map(layer => layer.propagate(learningRate));
    }

    train(options = {
        costFunction: utils.costFn.CROSS_ENTROPY,
        learningRate: 0.1,
        error: 0.005,
        epoch: 1000,
        logging: 0
    }, set) {
        const startAt = Date.now();
        let error = 1;
        let iterations = 0;

        while (iterations < options.epoch && error > options.error) {
            error = 0;
            iterations++;

            error += this._trainSet(set, options);
            error /= set.length;

            if (options.logging && iterations % options.logging === 0) {
                console.log(`LOG::train -- Iterations ${iterations}/${options.epoch} -- Error ${error}.`);
            }
        }

        return {
            error: error,
            iterations: iterations,
            executionTime: (Date.now() - startAt)
        };
    }

    /**
     * Return a JSON object representing the layer.
     * @returns {{id: number, name: string, activationFunction: (string|*), layers: {config: Object, input: Layer, hidden: Array<Layer>, output: Layer}}}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            activationFunction: this.activationFunction,
            layers: {
                config: this.layers.config,
                input: this.layers.input.toJSON(),
                hidden: this.layers.hidden.map(l => l.toJSON()),
                output: this.layers.output.toJSON()
            }
        };
    }

    _trainSet(set, options) {
        let errorSum = 0;
        for (const data of set) {
            const input = data.input;
            const expected = data.output;

            const outputResult = this.activate(input);
            this.propagate(options.learningRate, expected);

            errorSum += options.costFunction(expected, outputResult);

        }

        return errorSum;
    }
}
