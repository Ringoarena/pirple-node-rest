const userService = require('../../domain/services/userService')
const tokenService = require('../../domain/services/tokenService')

const handlers = {
  post: (data, callback) => {
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length ? data.payload.firstName.trim() : false
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length ? data.payload.lastName.trim() : false
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false
    let inputIsValid = firstName && lastName && phone && password && tosAgreement
    if (inputIsValid) {
      var userData = {
        firstName,
        lastName,
        phone,
        password,
        tosAgreement
      }
      userService.createUser(userData, (error) => {
        if (!error) {
          callback(201)
        } else {
          callback(500, error)
        }
      })
    } else {
      callback(400, { Error: 'missing required fields' })
    }
  },
  get: (data, callback) => {
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone : false
    var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
    var inputIsValid = phone
    if (inputIsValid) {
      tokenService.verifyToken(tokenId, phone, (tokenIsValid) => {
        if (tokenIsValid) {
          userService.getUserByPhone(phone, (error, userData) => {
            if (!error && userData) {
              callback(200, userData)
            } else {
              callback(404, error)
            }
          })
        } else {
          callback(403, { error: 'invalid token'})
        }
      })
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
  put: (data, callback) => {
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone : false
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length ? data.payload.firstName.trim() : false
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length ? data.payload.lastName.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
    var inputIsValid = phone
    if (inputIsValid) {
      tokenService.verifyToken(tokenId, phone, (tokenIsValid) => {
        if (tokenIsValid) {
          if (firstName || lastName || password) {
            var fields = { firstName, lastName, password }
            userService.updateUser(phone, fields, (error) => {
              if (!error) {
                callback(200)
              } else {
                callback(500, error)
              }
            })
          } else {
            callback(400, { error: 'missing fields to update' })
          }
        } else {
          callback(403, { error: 'invalid token' })
        }
      })
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
  delete: (data, callback) => {
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone : false
    var inputIsValid = phone
    if (inputIsValid) {
      var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
      tokenService.verifyToken(tokenId, phone, (tokenIsValid) => {
        if (tokenIsValid) {
          userService.deleteUser(phone, (error) => {
            if (!error) {
              callback(200)
            } else {
              callback(500, error)
            }
          })
        } else {
          callback(403, { error: 'invalid token' })
        }
      })
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
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