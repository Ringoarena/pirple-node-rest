const checkService = require("../../domain/services/checkService")
const tokenService = require("../../domain/services/tokenService")

const handlers = {
  post: (data, callback) => {
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].includes(data.payload.protocol) ? data.payload.protocol : false
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length ? data.payload.url.trim() : false
    var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].includes(data.payload.method) ? data.payload.method : false
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length ? data.payload.successCodes : false
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false
    var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
    if (protocol && url && method && successCodes && timeoutSeconds) {
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
    var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
    if (checkId) {
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
  put: (data, callback) => {
    var checkId = typeof(data.payload.checkId) == 'string' && data.payload.checkId.length ? data.payload.checkId : false
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].includes(data.payload.protocol) ? data.payload.protocol : false
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length ? data.payload.url.trim() : false
    var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].includes(data.payload.method) ? data.payload.method : false
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length ? data.payload.successCodes : false
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false
    var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
    if (checkId) {
      if (protocol || url || method || successCodes || timeoutSeconds) {
        checkService.getCheckById(checkId, (error, checkData) => {
          console.log(error, checkData)
          if (!error && checkData) {
            tokenService.verifyToken(tokenId, checkData.userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                if (protocol) {
                  checkData.protocol = protocol
                }
                if (url) {
                  checkData.url = url
                }
                if (method) {
                  checkData.method = method
                }
                if (successCodes) {
                  checkData.successCodes = successCodes
                }
                if (timeoutSeconds) {
                  checkData.timeoutSeconds = timeoutSeconds
                }
                checkService.updateCheck(checkData, (error) => {
                  if (!error) {
                    callback(200, { message: 'check updated' })
                  } else {
                    callback(500, error)
                  }
                })
              } else {
                callback(403, { error: 'invalid token'})
              }
            })
          } else {
            callback(404, { error: 'check not found' })
          }
        })
      } else {
        callback(400, { error: 'missing fields to update'})
      }
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
  delete: (data, callback) => {
    var checkId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.length ? data.queryStringObject.id : false
    var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
    if (checkId) {
      checkService.getCheckById(checkId, (error, checkData) => {
        if (!error && checkData) {
          tokenService.verifyToken(tokenId, checkData.userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
              checkService.deleteCheck(checkData, (error) => {
                if (!error) {
                  callback(200, { message: 'check deleted'})
                } else {
                  callback(500, error)
                }
              })
            } else {
              callback(403, { error: 'invalid token' })
            }
          })
        } else {
          callback(404, { error: 'check not found' })
        }
      })
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
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