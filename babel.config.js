"use strict";

module.exports = function (api) {

    const targets = {
        browsers: [
            "last 2 Chrome versions",
            "last 2 Firefox versions",
            "last 2 Safari versions",
            "last 2 Edge versions"
        ]
    }

    return {
        "presets": [
            [
                "@babel/preset-env",
                {
                    targets: targets,
                    //debug: true,
                    modules: false,
                    useBuiltIns: false,
                    corejs: false
                }
            ]
        ],
        "plugins": []
    };
};
