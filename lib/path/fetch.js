const request = require('request')
const denodeify = require('denodeify')
const promise = denodeify(request)
const fetch = function (url) {
  return promise(url).then((response) => response.body)
}

module.exports = fetch
