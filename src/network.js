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
            train: {
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
     * @param {number} [options.train.learningRate = 0.1] The value used to compute the output value in each neuron
     * @param {number} [options.train.error = 0.005] The maximum error value to reach
     * @param {number} [options.train.epoch = 1000] The number of iteration training
     * @param {number} [options.train.log = false] Show logs
     * @param {number} [options.train.logEveryTimes = 10] Show logs every * iterations
     * @private
     */
    _initialize(options) {
        options = Object.assign({
            name: 'N/A',
            activationFunction: utils.activationFunction.SIGMOID,
            layersSize: [100, 10, 1],
            train: {
                learningRate: 0.1,
                error: 0.005,
                epoch: 1000,
                log: false,
                logEveryTimes: 10
            }
        }, options);

        this._validateOrThrow(options);

        this.id = uuid.v4();
        this.name = options.name;
        this.config.activationFunction = options.activationFunction;
        this.config.layersSize = options.layersSize;
        this.config.layersCount = options.layersSize.length;
        this.config.train.learningRate = options.train.learningRate;
        this.config.train.error = options.train.error;
        this.config.train.epoch = options.train.epoch;
        this.config.train.log = options.train.log;
        this.config.train.logEveryTimes = options.train.logEveryTimes;

        this.config.layersSize.map(size => {
           this.layers.push(new Layer({
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
     * @param {number} options.train.learningRate The value used to compute the output value in each neuron
     * @param {number} options.train.error The maximum error value to reach
     * @param {number} options.train.epoch The number of iteration training
     * @param {number} options.train.log Show logs
     * @param {number} options.train.logEveryTimes Show logs every * iterations
     * @private
     */
    _validateOrThrow(options) {
        if (typeof options.name !== 'string') throw new Error('The name must be a string.');
        if (!Object.keys(utils.activationFunction).includes(options.activationFunction)) {
            throw new Error('The activationFunction must be in the utils.activationFunction.');
        }
        if (!Array.isArray(options.layersSize)) throw new Error('The layersSize must be an array of number.');
        if (options.layersSize.length < 2) throw new Error('The layersSize must have 2 or more values as input and output.');
        if (typeof options.train.learningRate !== 'number') throw new Error('The train.learningRate must be a number.');
        if (typeof options.train.error !== 'number') throw new Error('The train.error must be a number.');
        if (typeof options.train.epoch !== 'number') throw new Error('The train.epoch must be a number.');
        if (typeof options.train.log !== 'boolean') throw new Error('The train.log must be a boolean.');
        if (typeof options.train.logEveryTimes !== 'number') throw new Error('The train.logEveryTimes must be a number.');
    }

    train(set) {
        const layersCopy = Array.from(this.layers);
        const inputLayer = layersCopy.reverse().pop();
        const outputLayer = layersCopy.reverse().pop();
        const hiddenLayers = [].concat(...layersCopy);

        let epochCount = 0;
        let error = 1;
        let result = null;
        while (epochCount < this.train.epoch && error > this.train.error) {
            epochCount++;
            for (const data of set) {
                /* compute at first the input layer */
                const inputResult = inputLayer.compute(data.input);

                /* And then for each hidden layer */
                let hiddenResult = null;
                hiddenLayers.map((layer, i) => {
                    if (i === 0) {
                        /* The first hidden layer take the output of input layer */
                        hiddenResult = layer.compute(inputResult);
                    } else {
                        /* The rest of the hidden layer take the result of the previous hidden layer */
                        hiddenResult = layer.compute(hiddenResult);
                    }
                });
                result = outputLayer.compute(hiddenResult);
            }
        }
        console.log(result);
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
