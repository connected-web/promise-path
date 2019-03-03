const fs = require('fs-extra')
const { promisify } = require('util')
const make = promisify(fs.mkdirp)

module.exports = make
