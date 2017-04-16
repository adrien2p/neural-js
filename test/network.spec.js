const assert = require('chai').assert;
const fs = require('fs');

const Layer = require('../src/layer');
const Neuron = require('../src/neuron');
const Network = require('../src/network');

// FIXME this is temporary for test the network and show what is computed inside.
describe('Network', () => {
    it('should create a new network', () => {
        /* Create network from scratch */
        const network = new Network({
            layers: [
                new Layer({ neurons: [new Neuron()] }),
                new Layer({ neurons: [new Neuron()] }),
                new Layer({ neurons: [new Neuron()] }),
                new Layer({ neurons: [new Neuron()] })
            ]
        });

        network.train([{
            input: [1, 1],
            output: 0
        }], {
            iterations: 1
        });

        const stream = fs.createWriteStream(`./results/newtork-${new Date().toISOString().slice(0, 19)}_${network.id}.json`);
        const networkBuffer = Buffer(JSON.stringify(network.toJSON(), null, 4));
        stream.write(networkBuffer);
        stream.end();
    });
});