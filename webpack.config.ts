import path from 'path';
import webpack from 'webpack';
import WebpackBar from 'webpackbar';
import { VueLoaderPlugin } from 'vue-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const env = process.env

const VueApp = {
  mode: env.production ? 'production' : 'development',
  entry: './src/renderer/main.ts',

  // This should be checked if dev mode
  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: !env.production }
          },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json'
      })
    ],
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    },
    fallback: {
      path: require.resolve('path-browserify')
    }
  },
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new WebpackBar(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false'
    })
  ]
}

const ElectronApp = {
  target: 'electron10.1-main',
  mode: env.production ? 'production' : 'development',
  entry: './src/main/index.ts',
  // This should be checked if dev mode
  devtool: 'inline-source-map',
  node: {
    __dirname: true,
    __filename: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json'
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __static: `"${path.resolve(__dirname, 'static')}"`
    })
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}

module.exports = [VueApp, ElectronApp]
