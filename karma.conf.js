"use strict";

const webpackConfig = require("./webpack.config.js");

module.exports = function (config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine"],
        files: [
            {
                pattern: "src/**/*.ts"
            }
        ],
        preprocessors: {
            "src/**/*.ts": ["webpack", "sourcemap"]
        },
        webpack: {
            mode: "development",
            devtool: "source-map",
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        reporters: ["progress"],
        browsers: ["Chrome"],
        autoWatch: true,
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        sinleRun: true
    });
}
