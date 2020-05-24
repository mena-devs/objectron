const path = require('path')

const entry = path.join(__dirname, '/index.js')
const output = {
  path: path.join(__dirname, 'dist'),
  filename: 'objectron.bundle.js'
}

module.exports = {
  node: {
    fs: 'empty'
  },
  mode: 'production',
  entry: entry,
  output: output
}
