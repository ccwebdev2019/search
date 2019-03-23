const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const clientConfig = {
  entry: "./client/index.js",
  mode: "development",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/"
  },
  module: {
    rules: [{ test: /\.(js)$/, exclude: /node_modules/, use: "babel-loader" }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Graphing QL",
      filename: "index.html",
      template: "./client/index.html"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 8000
  }
};

const serverConfig = {
  entry: "./server/server.js",
  mode: "development",
  target: "node",
  externals: [nodeExternals()],
  output: {
    filename: "server.js",
    path: __dirname,
    publicPath: "/"
  },
  module: {
    rules: [{ test: /\.(js)$/, exclude: /node_mdules/, use: "babel-loader" }]
  }
};

module.exports = [clientConfig, serverConfig];
