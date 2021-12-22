var url = require('url')
var StringDecoder = require('string_decoder').StringDecoder

var resources = require('../resources')

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
  request.on('end', () => {
    buffer += decoder.end()
    var chosenHandler = resources.getHandler(trimmedPath)
    var data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    }
    chosenHandler(data, (statusCode, payload) => {
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

module.exports = unifiedServer