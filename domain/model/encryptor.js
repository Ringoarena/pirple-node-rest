var config = require('../../config')
var crypto = require('crypto');

const encryptor = {
  encrypt: (str) => {
    if (typeof(str) == 'string' && str.length) {
      return crypto.createHmac('sha256', config.privateKey).update(str).digest('hex');
    } else {
      return false
    }
  }
}

module.exports = encryptor