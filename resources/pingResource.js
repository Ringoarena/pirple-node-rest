const pingService = require('../services/pingService')

const handlers = {
  get: (data, callback) => {
    const result = pingService.ping()
    if (result.isHealthy) {
      callback(200, {message: result.message})
    } else {
      callback(500, {message: result.message})
    }
  }
}

var mapRouteToHandler = {
  ping: (data, callback) => {
    if (Object.keys(handlers).includes(data.method)) {
      handlers[data.method](data, callback)
    } else {
      callback(405)
    }
  }
}

module.exports = mapRouteToHandler