const checkService = require("../../domain/services/checkService")

const handlers = {
  post: (data, callback) => {
    var protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].includes(data.payload.protocol) ? data.payload.protocol : false
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length ? data.payload.url.trim() : false
    var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].includes(data.payload.method) ? data.payload.method : false
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length ? data.payload.successCodes : false
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false
    var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
    var inputIsValid = protocol && url && method && successCodes && timeoutSeconds
    if (inputIsValid) {
      var checkData = { protocol, url, method, successCodes, timeoutSeconds }
      checkService.createCheck(tokenId, checkData, (error, createdCheck) => {
        if (!error && createdCheck) {
          callback(200, { check: createdCheck })
        } else {
          callback(500, error)
        }
      })
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
  get: (data, callback) => {
    var checkId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.length ? data.queryStringObject.id : false
    var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
    var inputIsValid = checkId && tokenId
    if (inputIsValid) {
      checkService.getCheckById(checkId, tokenId, (error, checkData) => {
        if (!error && checkData) {
          callback(200, checkData)
        } else {
          callback(500, error)
        }
      })
    } else {
      callback(400, { error: 'missing required field' })
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
    var inputIsValid = checkId && (protocol || url || method || successCodes || timeoutSeconds)
    if (inputIsValid) {
      var fields = { protocol, url, method, successCodes, timeoutSeconds }
      checkService.updateCheck(checkId, tokenId , fields, (error) => {
        if (!error) {
          callback(200)
        } else {
          callback(500, error)
        }
      })
    } else {
      callback(400, { error: 'missing fields to update'})
    }
  },
  delete: (data, callback) => {
    var checkId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.length ? data.queryStringObject.id : false
    var tokenId = typeof(data.headers.tokenid) == 'string' ? data.headers.tokenid : false
    var inputIsValid = checkId && tokenId
    if (inputIsValid) {
      checkService.deleteCheck(checkId, tokenId, (error) => {
        if (!error) {
          callback(200, { message: 'check deleted'})
        } else {
          callback(500, error)
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