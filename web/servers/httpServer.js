var http = require('http')
var config = require('../../config')
var genericServer = require('./genericServer')

var httpServer = http.createServer((request, response) => {
  genericServer(request, response)
})

var start = () => {
  httpServer.listen(config.httpPort, () => {
    console.log('\x1b[33m%s\x1b[0m', `http server running in ${config.name} env, on port ${config.httpPort}`)
  })
}

module.exports = { start }