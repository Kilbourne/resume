'use strict';
var argv = process.env.ENV === 'production';
const webpack = require("webpack");


var webpackConfig = {
    context: "./assets/scripts",
    entry: {

        main: ["./main-webpack.js"]
    },
    output: {
        path: __dirname + "/dist/scripts",
        filename: "[name]-bundle.js",
        publicPath: process.env.DEVURL ? process.env.DEVURL + "scripts/" : "./scripts/"
    },
    devtool: (!argv ? '#source-map' : undefined),
    plugins: [

    ]
};
if (argv) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin(), new webpack.optimize.OccurrenceOrderPlugin());
}
module.exports = webpackConfig;
