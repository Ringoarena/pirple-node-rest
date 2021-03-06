const tokenService = require('../../domain/services/tokenService')

const handlers = {
  post: (data, callback) => {
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length ? data.payload.password.trim() : false
    var inputIsValid = phone && password
    if (inputIsValid) {
      tokenService.authenticate(phone, password, (error, tokenData) => {
        if (!error && tokenData) {
          callback(201, { token: tokenData })
        } else {
          callback(500, error)
        }
      })
    } else {
      callback(400, { error: 'missing required fields' })
    }
  },
  get: (data, callback) => {
    var tokenId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length ? data.queryStringObject.id : false
    var inputIsValid = tokenId
    if (inputIsValid) {
      tokenService.getTokenById(tokenId, (error, tokenData) => {
        if (!error, tokenData) {
          callback(200, { token: tokenData })
        } else {
          callback(404, error)
        }
      })
    } else {
      callback(400, { error: 'missing required field' })
    }
  },
  put: (data, callback) => {
    var tokenId = typeof(data.payload.tokenId) == 'string' && data.payload.tokenId.trim().length ? data.payload.tokenId.trim() : false
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? data.payload.extend : false
    var inputIsValid = tokenId && extend
    if (inputIsValid) {
      tokenService.extendToken(tokenId, (error) => {
        if (!error) {
          callback(204)
        } else {
          callback(500, error)
        }
      })
    } else {
      callback(400, { error: 'missing required fields'})
    }
  },
  delete: (data, callback) => {
    var tokenId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.length ? data.queryStringObject.id : false
    var inputIsValid = tokenId
    if (inputIsValid) {
      tokenService.deleteToken(tokenId, (error) => {
        if (!error) {
          callback(200)
        } else {
          callback(500, error)
        }
      })
    } else {
      callback(400, { error: 'missing required fields' })
    }
  },
}

var mapRouteToHandler = {
  token: (data, callback) => {
    if(Object.keys(handlers).includes(data.method)) {
      let handler = handlers[data.method]
      handler(data, callback)
    } else {
      callback(405)
    }
  }
}

module.exports = mapRouteToHandler