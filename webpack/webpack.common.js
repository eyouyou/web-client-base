'use strict'

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CleanCSSPlugin = require('less-plugin-clean-css')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const webpack = require('webpack')

const product =
  process.env.PRODUCT ?? "common"

const buildConfig = require(`../config/${product}.config`)

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index.tsx')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    // publicPath: "./"
  },
  resolve: {
    enforceExtension: false,
    extensions: ['.tsx', '.ts', '.js', '.less'],
    symlinks: true,
    // 根
    alias: {
      '~': path.resolve(__dirname, '../src'),
      assets: path.resolve(__dirname, '../assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js|(ts|js)x)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              include: [
                path.resolve(__dirname, '../src'),
                path.resolve(__dirname, '../global.d.ts'),
              ],
            }
          },
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                paths: [
                  path.resolve(__dirname, '../src'),
                  path.resolve(__dirname, '../node_modules/antd')
                ],
                plugins: [new CleanCSSPlugin({ advanced: true })],
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /\.md$/
    }),
    new webpack.DefinePlugin({
      BUILD_DATA: JSON.stringify(buildConfig),
    }),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      favicon: 'assets/favicon.ico'
    }),
    new WebpackBar()
  ]
}
