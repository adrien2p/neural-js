import uuid from 'uuid';

import utils from './utils';
import Layer from './layer';

/**
 * @class Network
 * @description
 */
export default class Network {
    constructor(options = {}) {
        this.id = null;
        this.name = '';
        this.config = {
            activationFunction: '',
            layersSize: [],
            layersCount: 0,
            training: {
                learningRate: 0,
                error: 0,
                epoch: 0,
                log: false,
                logEveryTimes: 0
            }
        };
        this.layers = [];

        this._initialize(options);
    }

    /**
     * Initialize the network with options value given, if not, use the default value configured.
     * @param {object} options Options to initialize the network
     * @param {string} [options.activationFunction = 'SIGMOID'] The name of the activation function used to normalize result in each neuron
     * @param {number} [options.layersSize = [100, 10, 1]] The size of each layer
     * @param {number} [options.training.learningRate = 0.1] The value used to compute the output value in each neuron
     * @param {number} [options.training.error = 0.005] The maximum error value to reach
     * @param {number} [options.training.epoch = 1000] The number of iteration training
     * @param {number} [options.training.log = false] Show logs
     * @param {number} [options.training.logEveryTimes = 10] Show logs every * iterations
     * @private
     */
    _initialize(options) {
        options = Object.assign({
            name: 'N/A',
            activationFunction: utils.activationFunction.SIGMOID,
            layersSize: [100, 10, 1],
            training: Object.assign({
                learningRate: 0.1,
                error: 0.005,
                epoch: 1000,
                log: false,
                logEveryTimes: 10
            }, options.training)
        }, options);

        this._validateOrThrow(options);

        this.id = uuid.v4();
        this.name = options.name;
        this.config.activationFunction = options.activationFunction;
        this.config.layersSize = options.layersSize;
        this.config.layersCount = options.layersSize.length;
        this.config.training.learningRate = options.training.learningRate;
        this.config.training.error = options.training.error;
        this.config.training.epoch = options.training.epoch;
        this.config.training.log = options.training.log;
        this.config.training.logEveryTimes = options.training.logEveryTimes;

        this.config.layersSize.map((size, i) => {
           this.layers.push(new Layer({
               index: i,
               activationFunction: this.config.activationFunction,
               neuronsCount: size
           }));
        });
        this.layers.map((layer, i) => i < this.layers.length - 1 && layer.fillInputOutputNeuronIds(this.layers[i + 1]));
    }

    /**
     * Valid network options before it's used to initialize the network config. Throw the options value isn't expected.
     * @param {object} options Options to initialize the network
     * @param {string} options.activationFunction The name of the activation function used to normalize result in each neuron
     * @param {number} options.layersSize The size of each layer
     * @param {number} options.training.learningRate The value used to compute the output value in each neuron
     * @param {number} options.training.error The maximum error value to reach
     * @param {number} options.training.epoch The number of iteration training
     * @param {number} options.training.log Show logs
     * @param {number} options.training.logEveryTimes Show logs every * iterations
     * @private
     */
    _validateOrThrow(options) {
        if (typeof options.name !== 'string') throw new Error('The name must be a string.');
        if (!Object.keys(utils.activationFunction).includes(options.activationFunction)) {
            throw new Error('The activationFunction must be in the utils.activationFunction.');
        }
        if (!Array.isArray(options.layersSize)) throw new Error('The layersSize must be an array of number.');
        if (options.layersSize.length < 2) throw new Error('The layersSize must have 2 or more values as input and output.');
        if (typeof options.training.learningRate !== 'number') throw new Error('The train.learningRate must be a number.');
        if (typeof options.training.error !== 'number') throw new Error('The train.error must be a number.');
        if (typeof options.training.epoch !== 'number') throw new Error('The train.epoch must be a number.');
        if (typeof options.training.log !== 'boolean') throw new Error('The train.log must be a boolean.');
        if (typeof options.training.logEveryTimes !== 'number') throw new Error('The train.logEveryTimes must be a number.');
    }

    /**
     *
     * @param {Array} set
     */
    train(set) {
        let epochCount = 0;
        let result = null;

        while (epochCount < this.config.training.epoch) {
            epochCount++;
            for (const data of set) {
                const neuronsResult = this.layers.reduce((values, layer) => {
                    return layer.compute(values);
                }, data.input);

                result = neuronsResult.reduce((previous, neuron) => {
                    previous += neuron.outputValue;
                    return previous;
                }, 0);

                console.log(result > 0 ? 1 : 0);
            }
        }

        return result;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            config: this.config,
            layers: this.layers.map(l => l.toJSON())
        };
    }
}
