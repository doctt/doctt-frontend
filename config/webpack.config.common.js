const helpers = require("./helpers");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
  entry: {
    vendor: "./src/vendor.ts",
    polyfills: "./src/polyfills.ts",
    main: "./src/main.ts"
  },

  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      Models: helpers.root("src/app/models"),
      Services: helpers.root("src/app/services"),
      Directives: helpers.root("src/app/directives"),
      Components: helpers.root("src/app/shared/components"),
      Modules: helpers.root("src/app/modules"),
    }
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(scss|sass|css)$/,
        loaders: ["to-string-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        loaders: [
          'babel-loader',
          {
            loader: "awesome-typescript-loader",
            options: {
              configFileName: helpers.root("tsconfig.json")
            }
          },
          "angular2-template-loader",
          "angular-router-loader"
        ],
        exclude: [/node_modules/]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(helpers.root("dist")),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
