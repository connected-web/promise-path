const { promisify } = require('util')
const fs = require('fs-extra')
const remove = promisify(fs.remove)

module.exports = remove
