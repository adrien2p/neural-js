const assert = require('chai').assert;
const fs = require('fs');

const utils = require('../src/utils');
const Network = require('../src/network');

describe('Network', () => {
    it.only('should create a complete network', () => {
        const network = new Network({
            activationFunction: utils.activationFunction.SIGMOID,
            name: 'Network:test',
            layers: {
                config: {
                    input: 2,
                    hidden: [3, 2, 3],
                    output: 1
                }
            }
        });

        const trainingOptions = {
            costFunction: utils.costFn.MSE,
            learningRate: 0.01,
            error: 0.005,
            epoch: 20000,
            logging: 100
        };

        network.train(trainingOptions, [{
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

        console.log(network.activate([1, 1]));
        console.log(network.activate([0, 0]));

        const json = JSON.stringify(network.toJSON(), null, 4);
        const stream = fs.createWriteStream(`./results/newtork-${new Date().toISOString().slice(0, 19)}_${network.id}.json`);
        stream.write(json);
        stream.end();
    });
});