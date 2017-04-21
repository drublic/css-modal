module.exports = {
  entry: {
    index: './js/index.js',
    plugins: './js/plugins.js'
  },
  output: {
    path: './bin',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
};
