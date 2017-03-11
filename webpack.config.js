module.exports = {
  entry: './js/index.js',
  output: {
    path: './bin/',
    filename: 'index.js'
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
