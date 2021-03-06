const pingService = require('../../domain/services/pingService')

const handlers = {
  get: (data, callback) => {
    const result = pingService.ping()
    var status = 200;
    if (!result.isHealthy) {
      status = 500;
    } 
    callback(status, result)
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