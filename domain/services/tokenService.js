var tokenRepository = require('../../repositories/tokenRepository')
var userRepository = require('../../repositories/userRepository')
var userService = require('./userService')
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
  },
}

module.exports = tokenService