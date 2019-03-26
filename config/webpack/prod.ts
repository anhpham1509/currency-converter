import CleanWebpackPlugin from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import postcssAssets from "postcss-assets";
import postcssPresetEnv from "postcss-preset-env";
import webpack from "webpack";
import webpackMerge from "webpack-merge";

import commonConfig from "./common";
import {appTitle, root} from "./helpers";
import bundleAnalyzer from "./helpers/analyzer";

const distPath: string = root("/dist");
const cleanPaths: string[] = [`${distPath}/**/*`];

// Output
const output: webpack.Output = {
  path: distPath,
  filename: "js/[name].[hash].js",
  chunkFilename: "js/[name].[hash].js",
  publicPath: "/"
};

// Rules
const styleRule: webpack.RuleSetRule = {
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        sourceMap: false,
        importLoaders: 2
      }
    },
    {
      loader: "postcss-loader",
      options: {
        plugins: () => [postcssPresetEnv(), postcssAssets({relative: true})],
        sourceMap: false
      }
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: false
      }
    }
  ]
};

const eotRule = {
  test: /\.eot(\?.*)?$/,
  use: {
    loader: "file-loader",
    options: {
      name: "fonts/[hash].[ext]"
    }
  }
};

const woffRule = {
  test: /\.(woff|woff2)(\?.*)?$/,
  use: {
    loader: "file-loader",
    options: {
      name: "fonts/[hash].[ext]"
    }
  }
};

const ttfRule = {
  test: /\.[ot]tf(\?.*)?$/,
  use: {
    loader: "url-loader",
    options: {
      limit: 10000,
      mimetype: "application/octet-stream",
      name: "fonts/[hash].[ext]"
    }
  }
};

const svgRule = {
  test: /\.svg(\?.*)?$/,
  use: {
    loader: "url-loader",
    options: {
      limit: 10000,
      mimetype: "image/svg+xml",
      name: "fonts/[hash].[ext]"
    }
  }
};

const imgRule = {
  test: /\.(jpe?g|png|gif)$/i,
  use: {
    loader: "url-loader",
    options: {
      limit: 10000,
      name: "fonts/[hash].[ext]"
    }
  }
};

const rules: webpack.RuleSetRule[] = [styleRule, eotRule, woffRule, ttfRule, svgRule, imgRule];

// Plugins
const cleanPlugin: webpack.Plugin = new CleanWebpackPlugin({
  cleanOnceBeforeBuildPatterns: cleanPaths
});

const miniCssExtractPlugin: webpack.Plugin = new MiniCssExtractPlugin({
  filename: "[name].[contenthash].css",
  chunkFilename: "[name].[contenthash].css"
});

const optimizeCssPlugin: webpack.Plugin = new OptimizeCssAssetsPlugin({
  cssProcessorOptions: {
    discardUnused: false,
    discardComments: {removeAll: true}
  }
});

const htmlPlugin: webpack.Plugin = new HtmlWebpackPlugin({
  title: appTitle,
  template: root("/src/index.html"),
  filename: "index.html",
  inject: "body",
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  }
});

// Exclude unnecessary locales in moment.js
const contextReplacementPlugin = new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/);

const definePlugin: webpack.Plugin = new webpack.DefinePlugin({
  "process.env": {
    BROWSER: JSON.stringify(true),
    NODE_ENV: JSON.stringify("production")
  }
});

const plugins: webpack.Plugin[] = [
  cleanPlugin,
  miniCssExtractPlugin,
  optimizeCssPlugin,
  contextReplacementPlugin,
  htmlPlugin,
  definePlugin
];

const optimization: webpack.Options.Optimization = {
  splitChunks: {
    chunks: "all"
  }
};

const useBundleAnalyzer: boolean = process.env.BUNDLE_ANALYZER === "true";

const config: webpack.Configuration = webpackMerge(
  commonConfig,
  {
    mode: "production",
    bail: true,
    devtool: "source-map",
    output,
    module: {
      rules
    },
    plugins,
    optimization
  },
  useBundleAnalyzer ? bundleAnalyzer : (undefined as any)
);

export default config;
