var tokenRepository = require('../repositories/tokenRepository')
var userService = require('./userService')

var uuid = () => {
  return Math.random().toString(16).slice(2)
}

var tokenService = {
  authenticate: (phone, password, callback) => {
    userService.getUserByPhone(phone, (error, userData) => {
      if (!error && userData) {
        var encryptedPassword = userService.encrypt(password)
        if (encryptedPassword == userData.encryptedPassword) {
          var tokenData = {
            id: uuid(),
            expires: Date.now() * 1000 * 60 * 60,
            phone
          }
          tokenRepository.create(tokenData, (error) => {
            if (!error) {
              callback(false, tokenData)
            } else {
              callback(error)
            }
          })
        } else {
          callback({ error: 'wrong password'})
        }
      } else {
        callback(error)
      }
    })
  },
  getTokenById: (id, callback) => {
    tokenRepository.read(id, callback)
  },
  updateToken: (tokenData, callback) => {
    tokenRepository.update(tokenData, callback)
  },
  deleteToken: (tokenData, callback) => {
    tokenRepository.delete(tokenData, callback)
  },
  verifyToken: (tokenId, phone, callback) => {
    tokenRepository.read(tokenId, (error, tokenData) => {
      if (!error && tokenData) {
        if (tokenData.phone == phone && tokenData.expires > Date.now()) {
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

module.exports = tokenService