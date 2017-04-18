import uuid from 'uuid';

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
            learningRate: 0.1,
            errorThreshold: 0.005,
            iterations: 1000,
            rate: 0.2,
            log: 0
        }, options.training);

        this.id = uuid.v4();
        this.name = options.name;
        this.config = {
            training: {
                learningRate: options.training.learningRate,
                errorThreshold: options.training.errorThreshold,
                iterations: options.training.iterations,
                rate: options.rate,
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
                learningRate: this.config.training.learningRate,
                neuronsCount: size
            }));
        });
        builtLayers.map((layer, i) => i < builtLayers.length - 1 && layer.initializeNeuronsConnections(builtLayers[i + 1]));

        /* Finally split them */
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
            error += this._trainSet(set, this.config.training.rate, utils.costFn.CROSSENTROPY);
            error /= set.length;

            /* Logging for each epoch % according to the user configuration */
            if (this.config.training.log > 0 && iterations % this.config.training.log === 0) {
                console.log(`iterations ${iterations}/${this.config.training.iterations} done -- Error ${error}.`);
            }
        }

        return { error, iterations };
    }

    // back-propagate the error into the network
    propagate(rate, output) {
        const reverseHiddenLayer = Array.from(this.layers.hidden).reverse();
        this.layers.output.propagate(rate, output);
        for (const layer of reverseHiddenLayer) {
            layer.propagate(rate);
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

    _trainSet(set, currentRate, costFn) {
        let errorSum = 0
        for (const data of set) {
            const result = this.activate(data.input);
            errorSum += costFn(data.output, result);

            /* Show computing information to debug network */
            if (this.config.training.debug) {
                console.log(`DEBUG:: data ${JSON.stringify(data)} -- output network result ${result} -- Error sum ${errorSum}.`);
            }
        }

        return errorSum;
    }
}
