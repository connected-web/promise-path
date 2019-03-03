const fs = require('fs-extra')
const { promisify } = require('util')
const write = promisify(fs.outputFile)

module.exports = write
