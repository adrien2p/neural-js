import uuid from 'uuid';
const fs = require('fs');

import utils from './utils';
import Layer from './layer';

/**
 * @class Network
 * @description
 */
export default class Network {
    constructor(options = {}) {
        options = Object.assign({
            name: 'N/A',
            activationFunction: utils.activationFunction.SIGMOID,
            layersSize: [100, 10, 1],
            training: {},
            debug: false
        }, options);

        options.training = Object.assign({
            costFn: utils.costFn.CROSS_ENTROPY,
            learningRate: 0.1,
            errorThreshold: 0.005,
            iterations: 1000,
            log: 0
        }, options.training);

        this.id = uuid.v4();
        this.name = options.name;
        this.config = {
            training: {
                costFn: options.training.costFn,
                learningRate: options.training.learningRate,
                errorThreshold: options.training.errorThreshold,
                iterations: options.training.iterations,
                log: options.training.log
            },
            debug: options.debug,
            activationFunction: options.activationFunction,
            layersSize: options.layersSize,
            layersCount: options.layersSize.length
        };
        this.layers = { input: null, hidden: [], output: {} };

        /* Generate layers according to the layersSize config */
        const builtLayers = [];
        this.config.layersSize.map((size, i) => {
            builtLayers.push(new Layer({
                index: i,
                activationFunction: this.config.activationFunction,
                neuronsCount: size
            }));
        });
        builtLayers.map((layer, i) => i < (builtLayers.length - 1) && layer.initializeNeuronsConnections(builtLayers[i + 1]));

        this.layers.input = builtLayers.shift();
        this.layers.output = builtLayers.pop();
        this.layers.hidden = builtLayers;
    }

    activate(input) {
        this.layers.input.activate(input);
        for (const layer of this.layers.hidden) {
            layer.activate();
        }

        return this.layers.output.activate();
    }

    train(set) {
        let error = 1;
        let iterations = 0;

        while (iterations < this.config.training.iterations && error > this.config.training.errorThreshold) {
            iterations++;
            error += this._trainSet(set, this.config.training.learningRate, this.config.training.costFn);
            error /= set.length;

            /* Show computing information to debug network */
            if (this.config.training.log && iterations % this.config.training.log === 0) {
                console.log(`LOG::train:: iterations ${iterations} -- Error : ${error}`);
            }
        }

        return { error, iterations };
    }

    // back-propagate the error into the network
    propagate(learningRate, outputResult) {
        const reverseLayers = Array.from(this.layers.hidden).reverse();
        this.layers.output.propagate(learningRate, outputResult);
        for (const layer of reverseLayers) {
            layer.propagate(learningRate);
        }
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            config: this.config,
            layers: {
                input: this.layers.input.toJSON(),
                hidden: this.layers.hidden.map(l => l.toJSON()),
                output: this.layers.output.toJSON()
            }
        };
    }

    _trainSet(set, learningRate, costFn) {
        let errorSum = 0;
        for (const data of set) {
            const outputResult = this.activate(data.input);
            this.propagate(learningRate, outputResult);

            errorSum += costFn(data.output, outputResult);
        }

        return errorSum;
    }
}
