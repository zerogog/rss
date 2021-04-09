const path = require('path')
module.exports = {
  context: __dirname, //eslint-disable-line
  target: 'webworker',
  entry: './index.js',
  mode: 'production',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // eslint-disable-line
    },
  },
}
