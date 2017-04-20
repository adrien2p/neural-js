import uuid from 'uuid';

import utils from './utils';
import Neuron from './neuron';

/**
 * @class Layer
 * @description
 */
export default class Layer {
    constructor(options = {}) {
        options = Object.assign({
            activationFunction: utils.activationFunction.SIGMOID,
            neuronsCount: 10
        }, options);

        this.id = uuid.v4();
        this.index = options.index || -1;
        this.config = {
            activationFunction: options.activationFunction,
            neuronsCount: options.neuronsCount
        };
        this.neurons = [];

        this.neurons.push(...Array.from({ length: options.neuronsCount }).map(() => new Neuron({
            activationFunction: this.config.activationFunction
        })));
    }

    /**
     * Add input/output connection to each neuron of the layer and the next layer.
     * @param {Layer} to The next layer to connection neuron
     */
    initializeNeuronsConnections(to) {
        for (const neuron of this.neurons) {
            for (const toNeuron of to.neurons) {
                toNeuron.connect(neuron, toNeuron);
                neuron.connect(neuron, toNeuron, 'outputs');
            }
        }
    }

    activate(input = null) {
        let i = 0;
        const activations = [];

        if (input !== null) {
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

        //console.log(activations);
        return activations;
    }

    propagate(learningRate, outputResult = null) {
        let i = 0;
        if (outputResult !== null) {
            if (outputResult.length !== this.config.neuronsCount) throw new Error("The output size must be the same of layer size.");

            for (const neuron of this.neurons) {
                neuron.propagate(learningRate, outputResult[i]);
                i++;
            }
        } else {
            for (const neuron of this.neurons) {
                //console.log('before', neuron.connections.inputs[Object.keys(neuron.connections.inputs)[0]].weight);
                neuron.propagate(learningRate);
                //console.log('after', neuron.connections.inputs[Object.keys(neuron.connections.inputs)[0]].weight);
                i++;
            }
        }
    }

    /**
     * Export the object to json format.
     * @returns {{id: *, config: ({activationFunction: string, neuronsCount: number, error: number}|*), neurons: Array}}
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
