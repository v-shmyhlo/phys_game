var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    // path: path.join(__dirname, 'build'),
    path: __dirname,
    publicPath: '/',
    filename: 'build.js'
  },
  plugins: [
  // new webpack.optimize.OccurenceOrderPlugin(),
  // new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  }
};
