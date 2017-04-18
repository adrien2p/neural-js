import uuid from 'uuid';

import utils from './utils';
import Neuron from './neuron';
import Connection from './connection';

/**
 * @class Layer
 * @description
 */
export default class Layer {
    constructor(options = {}) {
        options = Object.assign({
            activationFunction: utils.activationFunction.SIGMOID,
            learningRate: 0.1,
            neuronsCount: 10
        }, options);

        this.id = uuid.v4();
        this.index = options.index || -1;
        this.config = {
            activationFunction: options.activationFunction,
            learningRate: options.learningRate,
            neuronsCount: options.neuronsCount
        };
        this.neurons = [];

        this.neurons.push(...Array.from({ length: options.neuronsCount }).map(() => new Neuron({
            activationFunction: this.config.activationFunction,
            learningRate: this.config.learningRate
        })));
    }

    initializeNeuronsConnections(to) {
        for (const neuron of this.neurons) {
            for (const toNeuron of to.neurons) {
                const connection = new Connection(neuron, toNeuron);
                neuron.connect(connection, 'output');
                toNeuron.connect(connection, 'input');
            }
        }
    }

    activate(input = undefined) {
        let i = 0;
        const activations = [];

        if (typeof input !== 'undefined') {
            if (input.length !== this.neurons.length) throw new Error('The input size must be the same of layer size.');

            for (const neuron of this.neurons) {
                const activation = neuron.activate(input[i]);
                activations.push(activation);
                i++;
            }
        } else {
            for (const neuron of this.neurons) {
                const activation = neuron.activate();
                activations.push(activation);
                i++;
            }
        }

        return activations;
    }

    propagate(rate, output = undefined) {
        let i = 0;
        if (typeof output !== 'undefined') {
            if (output.length !== this.config.neuronsCount) throw new Error("The output size must be the same of layer size.");

            for (const neuron of this.neurons) {
                neuron.propagate(rate, output[i]);
                i++;
            }
        } else {
            for (const neuron of this.neurons) {
                neuron.propagate(rate);
                i++;
            }
        }
    }

    /**
     * Export the object to json format.
     * @returns {{id: *, config: ({activationFunction: string, neuronsCount: number, learningRate: number, error: number}|*), neurons: Array}}
     */
    toJSON() {
        return {
            id: this.id,
            index: this.index,
            config: this.config,
            neurons: this.neurons.map(n => n.toJSON())
        };
    }
}
