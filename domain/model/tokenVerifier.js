const tokenRepository = require("../../repositories/tokenRepository")


const tokenVerifier = {
  matchTokenAndPhone: (tokenId, phone, callback) => {
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
  },
  getActiveToken: (tokenId, callback) => {
    tokenRepository.read(tokenId, (error, tokenData) => {
      if (!error && tokenData) {
        if(Date.now() < tokenData.expires) {
          callback(tokenData)
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