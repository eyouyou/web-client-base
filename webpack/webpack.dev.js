'use strict'

const path = require('path')
const { merge } = require('webpack-merge')
const commonPackInfo = require('./webpack.common')
const yargs = require('yargs')
const webpack = require('webpack')

const development =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const { argv } = yargs.options({
    analysis: {
        type: 'boolean',
        default: false,
    },
    sourcemap: {
        type: 'boolean',
        default: true,
    },
})


module.exports = merge(commonPackInfo, {
    mode: development ? 'development' : 'production',
    output: {
        filename: '[name].js',
        publicPath: ''
    },
    devtool: argv.sourcemap && 'inline-source-map',
    devServer: {
        compress: false,
        port: 9000,
        hot: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            DEBUG_MODE: JSON.stringify(process.env.DEBUG_MODE),
        }),
    ]
})