const process = require('process');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const electronMain = {
  target: 'electron-main',
  entry: { index: './src/main/index.ts'},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
    plugins: [new TsConfigPathsPlugin()]
  },
  node: {
    // When in devmode, webpack needs to get it from node_modules
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        options: { //Added to filter out source map warnings for node modules.
          filterSourceMappingUrl: (url, resourcePath) => {
            return !/.*\/node_modules\/.*/.test(resourcePath);
          }
        }
      },
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new webpack.DefinePlugin({
      __static: `"${path.resolve(__dirname, 'dist', 'static')}"`
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'static', to: 'static' }]
    })
  ]
};

const electronRenderer = {
  target: 'electron-renderer',
  entry: { renderer: './src/renderer/index.ts'},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // resolves to "renderer.js"
    publicPath: './'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
    plugins: [new TsConfigPathsPlugin()]
  },
  node: {
    // When in devmode, webpack needs to get it from node_modules
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        options: { //Added to filter out source map warnings for node modules.
          filterSourceMappingUrl: (url, resourcePath) => {
            return !/.*\/node_modules\/.*/.test(resourcePath);
          }
        }
      },
      {
        test: /\.svg$/,
        use: ['vue-loader', 'vue-svg-loader']
      }
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html'
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'static', to: 'static' }]
    }),
    new webpack.DefinePlugin({
      __static: `"${path.resolve(__dirname, 'dist', 'static')}"`,
      // configure global feature flags for vue esm-bundler
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ],
};

module.exports = [
  electronMain,
  electronRenderer
];
