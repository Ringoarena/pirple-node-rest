const checkService = require("../../services/checkService")
const tokenService = require("../../services/tokenService")

const handlers = {
  post: (data, callback) => {
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].includes(data.payload.protocol) ? data.payload.protocol : false
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length ? data.payload.url.trim() : false
    var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].includes(data.payload.method) ? data.payload.method : false
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length ? data.payload.successCodes : false
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false
    if (protocol && url && method && successCodes && timeoutSeconds) {
      var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
      tokenService.getTokenById(tokenId, (error, tokenData) => {
        if (!error && tokenData) {
          var phone = tokenData.phone
          var checkData = {
            protocol,
            url,
            method,
            successCodes,
            timeoutSeconds
          }
          checkService.createCheck(phone, checkData, (error, checkData) => {
            if (!error && checkData) {
              callback(200, checkData)
            } else {
              callback(500, error)
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
  get: (data, callback) => {
    var checkId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.length ? data.queryStringObject.id : false
    if (checkId) {
      var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
      checkService.getCheckById(checkId, (error, checkData) => {
        if (!error && checkData) {
          tokenService.verifyToken(tokenId, checkData.userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, checkData)
            } else {
              callback(403, { error: 'invalid token' })
            }
          })
        } else {
          callback(404)
        }
      })
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
  put: (data, callback) => {},
  delete: (data, callback) => {},
}

const mapRouteToHandler = {
  checks: (data, callback) => {
    if(Object.keys(handlers).includes(data.method)) {
      let handler = handlers[data.method]
      handler(data, callback)
    } else {
      callback(405)
    }
  }
}

module.exports = mapRouteToHandler