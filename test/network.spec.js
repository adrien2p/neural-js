const assert = require('chai').assert;
const fs = require('fs');

const utils = require('../src/utils');
const Network = require('../src/network');

describe('Network', () => {
    it.only('should create a complete network', () => {
        /* Create network from scratch */
        const network = new Network({
            activationFunction: utils.activationFunction.SIGMOID,
            layersSize: [2, 5, 1],
            debug: false,
            training: {
                costFn: utils.costFn.CROSS_ENTROPY,
                learningRate: 0.2,
                iterations: 1000,
                log: 5
            }
        });

        network.train([{
            input: [0, 0],
            output: [0]
        }, {
            input: [0, 1],
            output: [1]
        }, {
            input: [1, 0],
            output: [1]
        }, {
            input: [1, 1],
            output: [0]
        }]);

        const json = JSON.stringify(network.toJSON(), null, 4);
        const stream = fs.createWriteStream(`./results/newtork-${new Date().toISOString().slice(0, 19)}_${network.id}.json`);
        stream.write(json);
        stream.end();
    });

    it('should create bidirectionnal connection between neurons', () => {
        const network = new Network({
            activationFunction: utils.activationFunction.SIGMOID,
            layersSize: [10, 5, 1]
        });

        const inputLayerFirstNeuron = network.layers.input.neurons[0];
        const firstHiddenLayerFirstNeuron = network.layers.hidden[0].neurons[0];

        assert.equal(firstHiddenLayerFirstNeuron.connections.inputs[inputLayerFirstNeuron.id].from.id, inputLayerFirstNeuron.id);
    });
});