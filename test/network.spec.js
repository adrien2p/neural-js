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
                    input: 3,
                    hidden: [5, 5],
                    output: 1
                }
            }
        });

        const json = JSON.stringify(network.toJSON(), null, 4);
        const stream = fs.createWriteStream(`./results/newtork-${new Date().toISOString().slice(0, 19)}_${network.id}.json`);
        stream.write(json);
        stream.end();
    });
});