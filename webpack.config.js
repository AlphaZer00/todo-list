const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  devtool: 'source-map',
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
      {
        test: /\.html$/i,
        use: [
          {
            loader: "html-loader",
          }
        ]
      },
    ],
  },
  plugins:
  [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        title: 'Todo List',
        inject: 'head',
        scriptLoading: 'defer',
    }),
    new FaviconsWebpackPlugin('src/assets/favicon.svg'),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};