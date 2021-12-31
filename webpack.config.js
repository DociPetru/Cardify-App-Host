const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    // filename: "index_bundle.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(scss|less|css|sass)$/i,
        // use: ["style-loader", "css-loader", "sass-loader", "less-loader"],
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
        exclude: [
          /\.(js|jsx|mjs)$/,
          /\.html$/,
          /\.json$/,
          /\.(less|config|variables|overrides)$/,
        ],
      },
    ],
  },
  plugins: [new HtmlWebPackPlugin({ template: "./src/index.html" })],

  optimization: {
    runtimeChunk: "single",
  },
};
