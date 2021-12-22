const pingResource = require('./pingResource')
const userResource = require('./usersResource')

var rootResource = {
  ...pingResource,
  ...userResource,
}

const getHandler = (trimmedPath) => {
  if (Object.keys(rootResource).includes(trimmedPath)) {
    return rootResource[trimmedPath]
  } else {
    return (data, callback) => {
      callback(404, { name: 'notFound handler'})
    }
  }
}

module.exports = { getHandler }