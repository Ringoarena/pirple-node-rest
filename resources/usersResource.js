const userService = require('../services/userService')

const handlers = {
  post: (data, callback) => {
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length ? data.payload.firstName.trim().length : false
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length ? data.payload.lastName.trim().length : false
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim().length : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length ? data.payload.password.trim().length : false
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false
    if (firstName && lastName && phone && password && tosAgreement) {
      userService.getUserByPhone(phone)
      userService.createUser()
      callback(201)
    } else {
      callback(400, { Error: 'missing required fields'})
    }
  },
  get: () => {},
  put: () => {},
  delete: () => {},
}

var mapRouteToHandler = {
  users: (data, callback) => {
    if(Object.keys(handlers).includes(data.method)) {
      let handler = handlers[data.method]
      handler(data, callback)
    } else {
      callback(405)
    }
  }
}

module.exports = mapRouteToHandler