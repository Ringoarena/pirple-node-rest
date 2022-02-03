var querystring = require('querystring')
var https = require('https')
var config = require('../config')

var twilioClient = {
  sendTwilioSMS: (phone, message, callback) => {
    phone = typeof(phone) == 'string' && phone.trim().length == 13 ? phone.trim() : false
    message = typeof(message) == 'string' && message.trim().length > 0 && message.trim().length <= 1600 ? message.trim() : false
    var inputIsValid = phone && message
    if (inputIsValid) {
      var payload = {
        from: config.fromPhone,
        to: phone,
        body: message
      }
      var stringPayload = querystring.stringify(payload)
      var requestDetails = {
        protocol: 'https:',
        hostname: 'api.twilio.com',
        method: 'POST',
        path: `/2010-04-01/Accounts/${config.twilio.accountId}/Messages.json`,
        auth: `${config.twilio.accountId}/${config.twilio.authToken}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(stringPayload),
        }
      }
      var request = https.request(requestDetails, (response) => {
        var status = response.statusCode
        if (status == 200 || status == 201) {
          callback(false)
        } else {
          callback({ error: `twilio reponse.status was ${status}` })
        }
      })
      request.on('error', (error) => {
        callback(error)
      })
      request.write(stringPayload)
      request.end()
    } else {
      callback({ error: 'invalid input' })
    }
  }
}

module.exports = twilioClient