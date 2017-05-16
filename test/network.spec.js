const assert = require('chai').assert;
const fs = require('fs');
const synaptic = require('synaptic');
const utils = require('../src/utils');
const Network = require('../src/network');

describe('Network', () => {
    it.only('should create a complete network', () => {
        const network = new Network({
            activationFunction: utils.activationFunction.LOGISTIC,
            name: 'Network:test',
            layers: {
                config: {
                    input: 2,
                    hidden: [5],
                    output: 1
                }
            }
        });

        const trainingOptions = {
            costFunction: utils.costFn.MSE,
            learningRate: 0.1,
            error: 0.05,
            epoch: 1000000,
            logging: 100
        };

        network.train(trainingOptions, [{
            input: [0, 0],
            output: [0]
        }, {
            input: [1, 0],
            output: [1]
        }, {
            input: [0, 1],
            output: [1]
        }, {
            input: [1, 1],
            output: [0]
        }]);

        console.log(network.activate([0, 0]));
        console.log(network.activate([0, 1]));
        console.log(network.activate([1, 0]));
        console.log(network.activate([1, 1]));

        /*const json = JSON.stringify(network.toJSON(), null, 4);
        const stream = fs.createWriteStream(`./results/newtork-${new Date().toISOString().slice(0, 19)}_${network.id}.json`);
        stream.write(json);
        stream.end();*/
    });
});