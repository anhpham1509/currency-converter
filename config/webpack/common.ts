import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import webpack from "webpack";
import {root} from "./helpers";

// Entry
const entry: webpack.Entry = {
  app: root("/src/index.tsx")
};

// Resolve
const resolve: webpack.Resolve = {
  modules: [root("/node_modules")],
  extensions: [".ts", ".tsx", ".js", ".jsx"]
};

// Rules
const babelRule: webpack.RuleSetRule = {
  test: /\.(ts|js)x?$/,
  use: [
    {
      loader: "babel-loader"
    },
    {
      loader: "ts-loader"
    }
  ],
  enforce: "pre",
  exclude: /node_modules/
};

const rules: webpack.RuleSetRule[] = [babelRule];

// Plugins
const progressPlugin = new webpack.ProgressPlugin();

const tsCheckerPlugin = new ForkTsCheckerWebpackPlugin();

const plugins: webpack.Plugin[] = [progressPlugin, tsCheckerPlugin];

const baseConfig: webpack.Configuration = {
  context: root(),
  entry,
  resolve,
  module: {
    rules
  },
  plugins
};

export default baseConfig;
