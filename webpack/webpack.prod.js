'use strict'

const path = require('path')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const TerserPlugin = require('terser-webpack-plugin')
const { merge, mergeWithRules } = require('webpack-merge')
const commonPackInfo = require('./webpack.common')

module.exports = merge(commonPackInfo, {
  mode: 'production',
  optimization: {
    runtimeChunk: 'single',
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /node_modules/,
        parallel: true,
        extractComments: true
      })
    ],
    splitChunks: {
      cacheGroups: {
        all: {
          priority: 1,
          name: 'all',
          chunks: 'all',
          minChunks: 1,
        },
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      ignoreOrder: false,
    }),
  ]
})