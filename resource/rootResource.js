const pingResource = require('./pingResource')

var rootResource = {
  ...pingResource,
  notFound: (data, callback) => {
    callback(404, { name: 'notFound handler'})
  }
}

module.exports = rootResource