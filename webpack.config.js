"use strict";

const path = require('path');

const mode = 'production';

module.exports = {
    mode: mode,
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.esm.mjs',
        library: {
            type: 'module', // output as ESM
        },
        chunkFormat: 'module', // important for .mjs output
        clean: true
    },
    experiments: {
        outputModule: true, // allow ESM output
    },
    devtool: mode === 'development' ? 'inline-source-map' : undefined,
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    target: ['web', 'es6'],
    optimization: {
        minimize: false
    }
};
