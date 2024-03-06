/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, "src")],
        use: "ts-loader",
      },
      // {
      //   test: /\.(jpg|png|svg|json)$/,
      //   type: "asset/resource",
      //   generator: {
      //     filename: "assets/[name][ext]",
      //   },
      // },
      { test: /\.(woff|woff2)$/, use: { loader: "url-loader" } },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    publicPath: "/",
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
};

