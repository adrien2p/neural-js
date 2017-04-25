import uuid from 'uuid';
import utils from './utils';

/**
 * @class Neuron
 * @description Neuron is a cell include in a layer, that's the core of the network which compute the output result.
 */
export default class Neuron {
    /**
     * @param {object} options Options configuration
     * @param {string} [options.activationFunction = 'SIGMOID'] Activation function use to squash the neuron state to the activation value and compute the derivative
     * @constructor
     */
    constructor(options = {
        activationFunction: utils.activationFunction.SIGMOID
    }) {
        this.id = uuid.v4();
        this.activationFunction = options.activationFunction;
        this.createdAt = new Date();
        this.oldState = 0;
        this.state = 0;
        this.activation = 0;
        this.derivative = 0;
        this.bias = Math.random() * 0.2 * 0.1;
        this.error = {
            responsibility: 0,
            projected: 0
        };
        this.neighbors = {};
        this.connections = {
            incoming: {},
            projected: {}
        };
    }

    /**
     * Create an incoming connection from another neuron to the actual neuron.
     * @param {object} connection
     * @function
     * @public
     */
    connect(connection) {
        this.connections.incoming[connection.id] = connection;
    }

    /**
     * Crate a projected connection from the actual neuron to another one.
     * @param {object} connection
     * @public
     */
    project(connection) {
        this.connections.projected[connection.id] = connection;
    }

    /**
     * Active the neuron, compute the new state, activation and derivative value.
     * @param {number} [input] The input value generally passed for the input layer neurons
     * @returns {number|*}
     */
    activate(input) {
        if (typeof input !== 'undefined') {
            this.activation = input;
            this.derivative = 0;
            this.bias = 0;
            return this.activation;
        }

        this.oldState = this.state;

        for (const connection of Object.keys(this.connections.incoming)) {
            const incomingConnection = this.connections.incoming[connection];
            const neuron = incomingConnection.from;
            this.state += incomingConnection.weight * neuron.activation;
        }
        this.state += this.bias;

        this.activation = this.squash(this.state);
        this.derivative = this.squash(this.state, true);

        return this.activation;
    }

    /**
     * Process the back propagation algorithm to adjust connections weight.
     * https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/
     * @param learningRate
     * @param target
     */
    propagate(learningRate, target) {
        let error = 0;

        if (typeof target !== 'undefined') {
            this.error.responsibility = this.error.projected = target - this.activation;
        } else {
            for (const connection of Object.keys(this.connections.projected)) {
                const projectedConnection = this.connections.projected[connection];
                const neuron = projectedConnection.to;

                error += neuron.error.responsibility * projectedConnection.oldWeight;
            }

            this.error.responsibility = this.error.projected = error;
        }

        for (const connection of Object.keys(this.connections.incoming)) {
            const incomingConnection = this.connections.incoming[connection];

            /*let gradient = this.error.projected;
            for (const neighbor of Object.keys(this.neighbors)) {
                gradient += this.neighbors[neighbor].error.responsibility;
            }*/

            incomingConnection.oldWeight = incomingConnection.weight;
            incomingConnection.weight += learningRate * this.error.responsibility * this.derivative * incomingConnection.from.activation;
        }

        this.bias += learningRate * this.error.responsibility;
    }

    /**
     * Squash the value parameter with one of the implemented function.
     * @param {number} value The number to squash
     * @param {boolean} derivative The derivative is expected or not
     * @returns {number}
     */
    squash(value, derivative = false) {
        switch (this.activationFunction) {
            case 'SIGMOID':
                const sigmoidFn = 1 / (1 + Math.pow(Math.E, -value));
                const sigmoidFnDerivative = sigmoidFn * (1 - sigmoidFn);
                if (derivative) return sigmoidFnDerivative;
                if (!derivative) return sigmoidFn;
                break;
            case 'TANH':
                const tanhFn = (2 / (1 + Math.pow(Math.E, -2 * value))) - 1;
                const tanhFnDerivative = tanhFn - Math.pow(tanhFn, 2);
                if (derivative) return tanhFnDerivative;
                if (!derivative) return tanhFn;
                break;
            default:
                throw new Error(`The activation function ${this.activationFunction} doesn't implemented yet.`);
        }
    }

    /**
     * Return a JSON object representing the neuron.
     * @param {boolean} stopPropagation To stop toJSON() circular connection
     * @returns {{id: number, activationFunction: string, createdAt: Date, state: number, activation: number, derivative: number, bias: number, error: number, connections: {incoming: {}, projected: {}}}}
     * @public
     */
    toJSON(stopPropagation) {
        const incomingConnectionsJSON = {};
        const projectedConnectionsJSON = {};
        const neighborsJSON = {};

        Object.keys(this.connections.incoming).map(connection => {
            incomingConnectionsJSON[connection] = Object.assign({}, this.connections.incoming[connection], {
                from: !stopPropagation ? this.connections.incoming[connection].from.toJSON(true) : 'Neuron',
                to: !stopPropagation ? this.connections.incoming[connection].to.toJSON(true) : 'Neuron'
            });
        });

        Object.keys(this.connections.projected).map(connection => {
            projectedConnectionsJSON[connection] = Object.assign({}, this.connections.projected[connection], {
                from: !stopPropagation ? this.connections.projected[connection].from.toJSON(true) : 'Neuron',
                to: !stopPropagation ? this.connections.projected[connection].to.toJSON(true) : 'Neuron'
            });
        });

        Object.keys(this.neighbors).map(neighbor => {
            neighborsJSON[neighbor] = !stopPropagation ? this.neighbors[neighbor].toJSON(true) : 'Neuron';
        });

        return {
            id: this.id,
            activationFunction: this.activationFunction,
            createdAt: this.createdAt,
            oldState: this.oldState,
            state: this.state,
            activation: this.activation,
            derivative: this.derivative,
            bias: this.bias,
            error: this.error,
            neighbors: neighborsJSON,
            connections: {
                incoming: incomingConnectionsJSON,
                projected: projectedConnectionsJSON
            }
        };
    }
}
