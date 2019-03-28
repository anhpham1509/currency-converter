import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";
import webpackMerge from "webpack-merge";

import commonConfig from "./common";

import {appTitle, root} from "./helpers";

// Output
const output: webpack.Output = {
  filename: "js/[name].js",
  publicPath: "/"
};

// Rules
const styleRule: webpack.RuleSetRule = {
  test: /\.scss$/,
  use: [
    {
      loader: "style-loader"
    },
    {
      loader: "css-loader"
    },
    {
      loader: "sass-loader"
    }
  ]
};

const assetRule: webpack.RuleSetRule = {
  test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
  loader: "file-loader"
};

const rules: webpack.RuleSetRule[] = [styleRule, assetRule];

// Plugins
const htmlPlugin: webpack.Plugin = new HtmlWebpackPlugin({
  title: appTitle,
  template: root("/src/index.html"),
  filename: "index.html",
  inject: "body"
});

// Hot Module Replacement plugin for hot mode in dev server
const hmrPlugin: webpack.Plugin = new webpack.HotModuleReplacementPlugin();

const plugins: webpack.Plugin[] = [htmlPlugin, hmrPlugin];

const devServer: webpackDevServer.Configuration = {
  host: "0.0.0.0",
  port: 8080,
  publicPath: "/",
  inline: true,
  hot: true,
  historyApiFallback: true,
  overlay: {
    warnings: true,
    errors: true
  },
  open: true,
  contentBase: root("/dist"),
  stats: "errors-only",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
};

const optimization: webpack.Options.Optimization = {
  minimize: false
};

const config: webpack.Configuration = webpackMerge(commonConfig, {
  mode: "development",
  devtool: "inline-source-map",
  output,
  module: {
    rules
  },
  plugins,
  devServer,
  optimization
});

export default config;
