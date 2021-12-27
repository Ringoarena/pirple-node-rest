const pingResource = require('./pingResource')
const userResource = require('./usersResource')
const tokenResource = require('./tokenResource')
const checkResource = require('./checkResource')

var resources = {
  ...pingResource,
  ...userResource,
  ...tokenResource,
  ...checkResource
}

const selectHandler = (path) => {
  if (Object.keys(resources).includes(path)) {
    return resources[path]
  } else {
    return (data, callback) => {
      callback(404, { name: 'notFound handler'})
    }
  }
}

module.exports = {  selectHandler }