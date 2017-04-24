export default {
    activationFunction: {
        SIGMOID: 'SIGMOID',
        TANH: 'TANH'
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