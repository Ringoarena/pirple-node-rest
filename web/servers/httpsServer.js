var https = require('https')
var fs = require('fs')
var config = require('../../config')
var unifiedServer = require('./genericServer')

var httpsServerOptions = {
  key: fs.readFileSync(`${__dirname}/https/key.pem`),
  certificate: fs.readFileSync(`${__dirname}/https/cert.pem`)
}

var httpsServer = https.createServer(httpsServerOptions, (request, response) => {
  unifiedServer(request, response)
})

var start = () => {
  httpsServer.listen(config.httpsPort, () => {
    console.log('\x1b[33m%s\x1b[0m', `https server running in ${config.name} env, on port ${config.httpsPort}`)
  })
}

module.exports = { start }