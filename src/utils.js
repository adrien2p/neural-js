export default {
    activationFunction: {
        SIGMOID: (value, derivative = false) => {
            const sigmoidFn = 1 / (1 + Math.pow(Math.E, -value));
            const sigmoidFnDerivative = sigmoidFn * (1 - sigmoidFn);
            if (derivative) return sigmoidFnDerivative;
            if (!derivative) return sigmoidFn;
        },
        TANH: (value, derivative = false) => {
            const tanhFn = (Math.exp(value) - (1 / Math.exp(value))) / (Math.exp(value) + (1 / Math.exp(value)));
            const tanhFnDerivative = tanhFn - Math.pow(tanhFn, 2);
            if (derivative) return tanhFnDerivative;
            if (!derivative) return tanhFn;
        },
        LOGISTIC: (value, derivative = false) => {
            const logisticFn = 1 / (1 + Math.exp(-value));
            const logisticFnDerivative = logisticFn * (1 - logisticFn);
            if (derivative) return logisticFnDerivative;
            if (!derivative) return logisticFn;
        }
    },
    costFn: {
        CROSS_ENTROPY: (expected, output) => {
            let crossEntropy = 0;
            output.map((value, i) => {
                crossEntropy -= (expected[i] * Math.log(value + 1e-15)) + ((1 - value) * Math.log((1 + 1e-15) - output[i]));
            });
            return crossEntropy;
        },
        MSE: (expected, output) => {
            let mse = 0;
            output.map((value, i) => {
                mse += Math.pow(expected[i] - value, 2);
            });
            return mse / output.length;
        },
        BINARY: (expected, output) => {
            let misses = 0;
            output.map((value, i) => {
                misses += Math.round(expected[i] * 2) !== Math.round(value * 2);
            });
            return misses;
        }
    }
};