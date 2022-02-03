var querystring = require('querystring')
var https = require('https')

var cfg = {
  fromPhone: '',
  accountId: 'asd',
  authToken: ''
}

var twilioClient = {
  sendTwilioSMS: (phone, message, callback) => {
    phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false
    message = typeof(message) == 'string' && message.trim().length > 0 && message.trim().length <= 1600 ? message.trim() : false
    var inputIsValid = phone && message
    if (inputIsValid) {
      var payload = {
        from: cfg.fromPhone,
        to: phone,
        body: message
      }
      var stringPayload = querystring.stringify(payload)
      var requestDetails = {
        protocol: 'https',
        hostname: 'api.twilio.com',
        method: 'POST',
        path: `/2010-04-01/Accounts/${cfg.accountId}/Messages.json`,
        auth: `${cfg.accountId}/${cfg.authToken}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(stringPayload),
        }
      }
    } else {
      callback({ error: 'invalid input' })
    }
  }
}