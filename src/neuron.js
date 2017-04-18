import uuid from 'uuid';

import utils from './utils';

/**
 * @class Neuron
 * @description
 */
export default class Neuron {
    constructor(options = {}) {
        options = Object.assign({
            activationFunction: utils.activationFunction.SIGMOID,
            learningRate: 0.1
        }, options);

        this.id = uuid.v4();
        this.oldState = 0;
        this.state = 0; // value before normalize
        this.activation = 0; // value after normalize
        this.derivative = 0; // derivative of this.activation
        this.bias = Math.random() * 0.2 - 0.1;
        this.connections = { input: {}, output: {} };
        this.config = {
            activationFunction: options.activationFunction,
            learningRate: options.learningRate
        };
    }

    connect(connection, target = 'input') {
        if (this.connections[target][connection.id]) return;
        const id = target === 'input' ? connection.from.id : connection.to.id;
        this.connections[target][id] = connection;
    }

    activate(input = undefined) {
        if (typeof input !== 'undefined') {
            this.activation = input;
            this.derivative = 0;
            this.bias = 0;
            return this.activation;
        }

        this.oldState = this.state;

        this.state = this.weight * this.state + this.bias;

        for (const key of Object.keys(this.connections)) {
            this.state += this.connections[key].weight * this.connections[key].activation;
        }

        this.activation = this.normalize(this.state);
        this.derivative = this.normalize(this.state, true);

        return this.activation;
    }

    normalize(value, derivative = false) {
        switch (this.config.activationFunction) {
            case 'SIGMOID':
                const f = (1 / (1 + Math.pow(Math.E, -value)));
                if (!derivative) return f;
                if (derivative) return f / (1 - f);
                break;
            case 'TANH':
                return (2 / (1 + Math.pow(Math.E, -(2 * value))));
            default:
                throw new Error(`The activationFunction ${this.config.activationFunction} isn't implemented yet.`);
        }
    }


    /**
     * Export the object to json format.
     * @param {boolean} stopPropagation Stop toJSON function to avoid circular references
     * @returns {{id: *, oldState: (number|*), state: (number|*), activation: (*|number), derivative: (number|*), bias: number, connections: {input: (boolean|Array|string), output: (boolean|Array|string)}, config: ({activationFunction: (string|*|string), learningRate: number}|*)}}
     */
    toJSON(stopPropagation) {
        return {
            id: this.id,
            oldState: this.oldState,
            state: this.state,
            activation: this.activation,
            derivative: this.derivative,
            bias: this.bias,
            connections: {
                input: !stopPropagation && Object.keys(this.connections.input).map(key => this.connections.input[key].toJSON()) || 'stop propagation',
                output: !stopPropagation && Object.keys(this.connections.output).map(key => this.connections.output[key].toJSON()) || 'stop propagation'
            },
            config: this.config
        };
    }
}
