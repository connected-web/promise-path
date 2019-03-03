const glob = require('glob')
const { promisify } = require('util')
const find = promisify(glob)

module.exports = find
