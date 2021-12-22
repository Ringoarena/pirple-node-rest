const pingService = require('../service/pingService')

var router = {
  ping: (data, callback) => {
    console.log('using ping handler from pingResource')
    const result = pingService.ping()
    if (result.isHealthy) {
      callback(200, {message: result.message})
    } else {
      callback(500, {message: result.message})
    }
  }
}

module.exports = router