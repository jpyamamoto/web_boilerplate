const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const HtmlWebPackPlugin = require('html-webpack-plugin');

const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const TerserPlugin = require('terser-webpack-plugin');

const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');


const APP_NAME = 'Web Boilerplate';
const APP_DESCRIPTION = 'Boilerplate for landing pages';
const APP_BACKGROUND_COLOR = '#252627';
const APP_THEME_COLOR = '#292A2D'


module.exports = {
  entry: {
    main: './src/entrypoints/index.js',
    styles: './src/entrypoints/styles.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              attrs: ['img:src', 'video:poster', 'source:src']
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(hbs|handlebars)$/,
        loader: 'handlebars-loader'
      },
      {
        test: /\.(png|jpg|svg|gif|webm|mp4|ttf|eot|woff)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash].[ext]',
              context: 'src'
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/pages/index.hbs',
      filename: './index.html',
      chunks: ['main', 'styles'],
      minify: process.env.NODE_ENV === 'production' ? {
        html5: true,
        collapseWhitespace: true,
        caseSensitive: true,
        removeComments: true,
        removeEmptyElements: true
      } : {},
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css'
    }),
    ...process.env.NODE_ENV === 'production' ? [new FaviconsWebpackPlugin({
      logo: './src/meta/favicon.png',
      mode: 'webapp',
      devMode: 'webapp',
      favicons: {
        appName: APP_NAME,
        appDescription: APP_DESCRIPTION,
        developerName: 'Juan Pablo Yamamoto',
        developerURL: 'https://jpyamamoto.com/',
        background: APP_BACKGROUND_COLOR,
        theme_color: APP_THEME_COLOR,
        icons: {
          coast: false,
          yandex: false
        }
      }
    })] : [],
    new CleanWebpackPlugin(),
    new ImageminPlugin({
      // Uncomment for testing purposes.
      disable: process.env.NODE_ENV === 'development',
      test: /\.(jpe?g|png|gif|svg)$/i,
      minFileSize: 500000,
      pngquant: {
        quality: '95-100'
      },
      plugins: [
        imageminMozjpeg({
          quality: 50,
          progressive: true
        })
      ]
    }),
    autoprefixer,
  ]
};
