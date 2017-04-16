const assert = require('chai').assert;
const fs = require('fs');

const Neuron = require('../src/neuron');
const Network = require('../src/network');

// FIXME this is temporary for test the network and show what is computed inside.
describe('Network', () => {
    it('should create a new network', () => {
        const network = new Network();
        const neuron = new Neuron();

        console.log(neuron.process(10));

        const stream = fs.createWriteStream(`./results/newtork-${new Date().toISOString().slice(0, 10)}_${network.id}.json`);
        const networkBuffer = Buffer(JSON.stringify(network.toJSON(), null, 4));
        stream.write(networkBuffer);
        stream.end();
    });
});