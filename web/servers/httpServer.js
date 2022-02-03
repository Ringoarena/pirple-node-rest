var http = require('http')
var config = require('../../config')
var genericServer = require('./genericServer')

var httpServer = http.createServer((request, response) => {
  genericServer(request, response)
})
httpServer.listen(config.httpPort, () => {
  console.log(`http server running in ${config.name} env, on port ${config.httpPort}`)
})
