import uuid from 'uuid';

import utils from './utils';

/**
 * @class Neuron
 * @description
 */
export default class Neuron {
    constructor(options = {}) {
        options = Object.assign({
            activationFunction: utils.activationFunction.SIGMOID
        }, options);

        this.id = uuid.v4();
        this.oldState = 0;
        this.state = 0; // value before normalize
        this.activation = 0; // value after normalize
        this.derivative = 0; // derivative of this.activation
        this.responsibility = 0; // error between output and result
        this.bias = Math.random() * 0.2 - 0.1;
        this.connections = {
            inputs: {},
            outputs: {},
            selfConnection: {
                id: uuid.v4(),
                from: this,
                to: this,
                weight: 0,
                gain: 1
            }
        };
        this.error = {
            responsibility: 0,
            projected: 0
        };
        this.config = {
            activationFunction: options.activationFunction
        };
    }

    connect(from, to, target = 'inputs') {
        const id = uuid.v4();
        this.connections[target][id] = {
            id: id,
            from: from,
            to: to,
            weight: Math.random() * 0.2 - 0.1,
            gain: 1
        };
    }

    activate(input = null) {
        if (input !== null) {
            this.activation = input;
            this.derivative = 0;
            this.bias = 0;
            return this.activation;
        }

        this.oldState = this.state;

        this.state = this.connections.selfConnection.weight * this.connections.selfConnection.gain * this.state + this.bias;
        //console.log(this.state);

        for (const key of Object.keys(this.connections.inputs)) {
            const input = this.connections.inputs[key];
            this.state += input.from.activation * input.weight * input.gain;
            //console.log(input.from.activation, input.from.id);
        }

        this.activation = this.normalize(this.state);
        this.derivative = this.normalize(this.state, true);

        for (const key of Object.keys(this.connections.inputs)) {
            this.connections.inputs[key].gain = this.activation;
        }

        //console.log(this.state);
        //console.log(this.activation);
        return this.activation;
    }

    propagate(learningRate, outputResult = null) {
        let error = 0;
        let isOutput = outputResult !== null;

        if (isOutput) {
            /* responsibility error transmitted to the output result from output neuron */
            this.error.responsibility = outputResult - this.activation;
        } else {
            /* Go through the output connections (opposite direction from activate function) */
            for (const key of Object.keys(this.connections.outputs)) {
                const output = this.connections.outputs[key];
                error += output.gain * output.weight;
            }

            /* projected error responsibility transmitted to the next layer neurons during activation */
            this.error.projected = this.derivative * error;

            /* adjust incoming connection weight */
            for (const key of Object.keys(this.connections.inputs)) {
                const input = this.connections.inputs[key];
                input.weight += learningRate * this.error.projected;
            }
        }
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
     * @returns {{id: *, oldState: (number|*), state: (number|*), activation: (*|number), derivative: (*|number), responsibility: number, bias: number, error: ({responsibility: number, projected: number}|*), trace: *, connections: ({inputs: {}, outputs: {}, selfConnection: {id: *, from: Neuron, to: Neuron, weight: number, gain: number}}|*), config: ({activationFunction: (string|*|string)}|*)}}
     */
    toJSON(stopPropagation) {
        let selfConnectionToJSON = {};
        const inputConnectionsToJSON = {};
        const outputConnectionsToJSON = {};

        if (!stopPropagation) {
            for (const key of Object.keys(this.connections.inputs)) {
                const input = this.connections.inputs[key];
                inputConnectionsToJSON[key] = input;
                inputConnectionsToJSON[key].from.toJSON(true);
                inputConnectionsToJSON[key].to.toJSON(true);
            }

            for (const key of Object.keys(this.connections.outputs)) {
                const output = this.connections.outputs[key];
                outputConnectionsToJSON[key] = output;
                outputConnectionsToJSON[key].from.toJSON(true);
                outputConnectionsToJSON[key].to.toJSON(true);
            }

            selfConnectionToJSON[this.connections.selfConnection.id] = this.connections.selfConnection;
        }

        return {
            id: this.id,
            oldState: this.oldState,
            state: this.state,
            activation: this.activation,
            derivative: this.derivative,
            responsibility: this.responsibility,
            bias: this.bias,
            error: this.error,
            trace: this.trace,
            connections: {
                inputs: inputConnectionsToJSON,
                outputs: outputConnectionsToJSON,
                selfConnectionToJSON: selfConnectionToJSON
            },
            config: this.config
        };
    }
}
