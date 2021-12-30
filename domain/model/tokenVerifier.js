const tokenRepository = require("../../repositories/tokenRepository")


const tokenVerifier = {
  verify: (tokenId, phone, callback) => {
    tokenRepository.read(tokenId, (error, tokenData) => {
      if (!error && tokenData) {
        if (tokenData.phone == phone && Date.now() < tokenData.expires) {
          callback(true)
        } else {
          callback(false)
        }
      } else {
        callback(false)
      }
    })
  }
}

module.exports = tokenVerifier