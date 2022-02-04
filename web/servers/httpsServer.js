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
    console.log(`https server running in ${config.name} env, on port ${config.httpsPort}`)
  })
}

module.exports = { start }