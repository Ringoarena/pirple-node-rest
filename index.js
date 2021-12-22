var http = require('http')
var https = require('https')
var fs = require('fs')
var url = require('url')
var StringDecoder = require('string_decoder').StringDecoder
var config = require('./config')

const pingService = require('./service/pingService')

var httpServer = http.createServer((request, response) => {
  unifiedServer(request, response)
})
httpServer.listen(config.httpPort, () => {
  console.log(`http server running in ${config.name} env, on port ${config.httpPort}`)
})

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

var unifiedServer = (request, response) => {
  var parsedUrl = url.parse(request.url, true)
  var path = parsedUrl.pathname
  var trimmedPath = path.replace(/^\/+|\/+$/g,'')
  var queryStringObject = parsedUrl
  var method = request.method.toLowerCase()
  var headers = request.headers

  var decoder = new StringDecoder('utf-8')
  var buffer = ''
  request.on('data', function(data){
    buffer += decoder.write(data)
  })
  request.on('end', function(){
    buffer += decoder.end()
    var chosenHandler = router[trimmedPath] || router.notFound
    var data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    }
    chosenHandler(data, function(statusCode, payload){
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
      payload = typeof(payload) === 'object' ? payload : {}
      let payloadString = JSON.stringify(payload)
      response.setHeader('Content-Type','application/json')
      response.writeHead(statusCode)
      response.end(payloadString)
      console.log(`Returning code:${statusCode} and body ${payloadString}`)
    })
  })
}

var handlers = {
  ping: (data, callback) => {
    const result = pingService.ping()
    if (result.isHealthy) {
      callback(200, {message: result.message})
    } else {
      callback(500, {message: result.message})
    }
  },
  notFound: (data, callback) => {
    callback(404, { name: 'notFound handler'})
  }
};

var router = {
  ping: handlers.ping,
  notFound: handlers.notFound
}