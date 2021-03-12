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
  entry: { index: './src/main/index.ts' },
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
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
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
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/i,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader'
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
