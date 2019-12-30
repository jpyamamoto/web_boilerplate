const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

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
    new CleanWebpackPlugin(),
    // Comment when not importing meta files (Eg. favicons, browser specs, etc).
    new CopyWebpackPlugin([
      { from: './src/meta', to: './' },
    ]),
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
