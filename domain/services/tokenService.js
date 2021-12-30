var tokenRepository = require('../../repositories/tokenRepository')
var userRepository = require('../../repositories/userRepository')
var encryptor = require('../model/encryptor')
var uuidGenerator = require('../../lib/uuidGenerator')

var tokenService = {
  authenticate: (phone, password, callback) => {
    userRepository.read(phone, (error, userData) => {
      if (!error && userData) {
        var encryptedPassword = encryptor.encrypt(password)
        if (encryptedPassword == userData.encryptedPassword) {
          var tokenData = {
            id: uuidGenerator.generate(),
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
  extendToken: (tokenId, callback) => {
    tokenRepository.read(tokenId, (error, tokenData) => {
      if (!error && tokenData) {
        if (Date.now() < tokenData.expires) {
          tokenData.expires = Date.now() + 1000 * 60 * 60
          tokenRepository.update(tokenData, callback)
        } else {
          callback({ error: 'token expired' })
        }
      } else {
        callback(error)
      }
    })
  },
  deleteToken: (tokenId, callback) => {
    tokenRepository.delete(tokenId, callback)
  },
  verifyToken: (tokenId, phone, callback) => {
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
}

module.exports = tokenService