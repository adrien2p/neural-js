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
}
