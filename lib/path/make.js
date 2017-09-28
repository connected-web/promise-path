const fs = require('fs-extra')
const denodeify = require('denodeify')
const make = denodeify(fs.mkdirp)

module.exports = make
