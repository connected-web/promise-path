const request = require('request')
const { promisify } = require('util')
const promise = promisify(request)
const fetch = function (url) {
  return promise(url).then((response) => response.body)
}

module.exports = fetch
