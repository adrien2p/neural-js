import uuid from 'uuid';
import utils from './utils';
import Neuron from './Neuron';

/**
 * @class Layer
 * @description Layer is an element constituent the network, it's the element which contain neurons.
 */
export default class Layer {
    /**
     * @param {object} options Options configuration
     * @param {string} [options.type = ''] Type of the layer (input, hidden, output)
     * @param {number} [options.size = 5] Count of neuron in the layer
     * @param {string} [options.activationFunction = 'SIGMOID'] The activation function used by neurons
     * @constructor
     */
    constructor(options = {
        type: 'N/A',
        size: 5,
        activationFunction: utils.activationFunction.SIGMOID
    }) {
        this.id = uuid.v4();
        this.type = options.type;
        this.neurons = {};

        /* Create all neurons according size configuration in the layer */
        for (let i = 0; i < options.size; i++) {
            const neuron = new Neuron({
                activationFunction: options.activationFunction || null
            });
            this.neurons[neuron.id] = neuron;
        }

        /* Add neighbors on each neurons */
        for (const neuron of Object.keys(this.neurons)) {
            for (const neighborNeuron of Object.keys(this.neurons)) {
                if (neuron !== neighborNeuron) this.neurons[neuron].neighbors[neighborNeuron] = this.neurons[neighborNeuron];
            }
        }
    }

    /**
     * Project connection between all the neurons of the layer and the neurons of the next layer passed.
     * @param {Layer} nextLayer The next layer onto connect neurons
     * @public
     */
    project(nextLayer) {
        for (const neuron of Object.keys(this.neurons)) {
            for (const nextLayerNeuron of Object.keys(nextLayer.neurons)) {
                const weight = Math.random() * 0.2 * 0.1;
                const connection = {
                    id: uuid.v4(),
                    from: this.neurons[neuron],
                    to: nextLayer.neurons[nextLayerNeuron],
                    oldWeight: weight,
                    weight: weight
                };
                this.neurons[neuron].project(connection);
                nextLayer.neurons[nextLayerNeuron].connect(connection);
            }
        }
    }

    /**
     * Activate all the layer neurons and return all computed activation values.
     * @param {Array<number>} [input] The input pass through the layer to activate the input layer neurons
     * @returns {Array<number>}
     */
    activate(input) {
        const activations = [];

        let index = 0;
        if (typeof input !== 'undefined') {
            if (input.length !== Object.keys(this.neurons).length) throw new Error('The input size must be the same as the number of neurons in the input layer.');
            for (const neuron of Object.keys(this.neurons)) {
                const activation = this.neurons[neuron].activate(input[index]);
                activations.push(activation);
                index++;
            }
        } else {
            for (const neuron of Object.keys(this.neurons)) {
                const activation = this.neurons[neuron].activate();
                activations.push(activation);
                index++;
            }
        }

        return activations;
    }

    propagate(learningRate, expected) {
        let index = 0;
        if (typeof expected !== 'undefined') {
            if (expected.length !== Object.keys(this.neurons).length) throw new Error('The input size must be the same as the number of neurons in the output layer.');
            for (const neuron of Object.keys(this.neurons)) {
                this.neurons[neuron].propagate(learningRate, expected[index]);
                index++;
            }
        } else {
            for (const neuron of Object.keys(this.neurons)) {
                this.neurons[neuron].propagate(learningRate);
                index++;
            }
        }
    }

    /**
     * Return a JSON object representing the layer.
     * @returns {{id: number, type: string, neurons: {Neuron}}}
     * @public
     */
    toJSON() {
        const neuronsJson = {};
        Object.keys(this.neurons).map(neuron => neuronsJson[neuron] = this.neurons[neuron].toJSON());

        return {
            id: this.id,
            type: this.type,
            neurons: neuronsJson
        };
    }
}
