export default {
    activationFunction: {
        SIGMOID: 'SIGMOID',
        TANH: 'TANH'
    },
    costFn: {
        CROSSENTROPY: (output, result) => {
            let crossEntropy = 0;
            result.map((value, i) => {
                crossEntropy -= (output[i] * Math.log(value + 1e-15)) + ((1 - output[i]) * Math.log((1 + 1e-15) - value)); // +1e-15 is a tiny push away to avoid Math.log(0)
            });
            return crossEntropy;
        },
        MSE: (output, result) => {
            let mse = 0;
            result.map((value, i) => {
                mse += Math.pow(output[i] - value, 2);
            });
            return mse / result.length;
        },
        BINARY: (output, result) => {
            let misses = 0;
            result.map((value, i) => {
                misses += Math.round(output[i] * 2) !== Math.round(value * 2);
            });
            return misses;
        }
    }
};