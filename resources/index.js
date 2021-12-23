const pingResource = require('./pingResource')
const userResource = require('./usersResource')
const tokenResource = require('./tokenResource')

var resources = {
  ...pingResource,
  ...userResource,
  ...tokenResource
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