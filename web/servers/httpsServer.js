var https = require('https')
var fs = require('fs')
var config = require('../../config')
var unifiedServer = require('./genericServer')

var httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  certificate: fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsServerOptions, (request, response) => {
  unifiedServer(request, response)
})
httpsServer.listen(config.httpsPort, () => {
  console.log(`https server running in ${config.name} env, on port ${config.httpsPort}`)
})