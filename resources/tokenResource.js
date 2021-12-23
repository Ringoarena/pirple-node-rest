const tokenService = require('../services/tokenService')
const userService = require('../services/userService')

const handlers = {
  post: (data, callback) => {
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length ? data.payload.password.trim() : false
    if (phone && password) {
      userService.getUserByPhone(phone, (error, userData) => {
        if (!error && userData) {
          var encryptedPassword = userService.encrypt(password)
          if (encryptedPassword == userData.encryptedPassword) {
            tokenService.authenticate(phone, (error, tokenData) => {
              if (!error && tokenData) {
                callback(201, { token: tokenData })
              } else {
                callback(500, { error: 'could not authenticate' })
              }
            })
          } else {
            callback(400, { error: 'incorrect password'})
          }
        } else {
          callback(404, { error: 'user not found'})
        }
      })

    } else {
      callback(400, { error: 'missing required fields'})
    }
  },
  get: (data, callback) => {
    tokenService.authenticate()
  },
  put: (data, callback) => {
    tokenService.authenticate()
  },
  delete: (data, callback) => {
    tokenService.authenticate()
  },
}

var mapRouteToHandler = {
  authenticate: (data, callback) => {
    if(Object.keys(handlers).includes(data.method)) {
      let handler = handlers[data.method]
      handler(data, callback)
    } else {
      callback(405)
    }
  }
}

module.exports = mapRouteToHandler