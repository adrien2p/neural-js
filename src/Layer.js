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
                this.neurons[neuron].project(nextLayer.neurons[nextLayerNeuron]);
                nextLayer.neurons[nextLayerNeuron].connect(this.neurons[neuron]);
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
