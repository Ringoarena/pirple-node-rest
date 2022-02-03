var userRepository = require('../../repositories/userRepository')
var checkRepository = require('../../repositories/checkRepository')
var encryptor = require('../model/encryptor')
const tokenVerifier = require('../model/tokenVerifier')

var userService = {
  createUser: (userData, callback) => {
    userData.encryptedPassword = encryptor.encrypt(userData.password)
    delete userData.password
    userRepository.create(userData, callback)
  },
  getUserByPhone: (phone, tokenId, callback) => {
    userRepository.read(phone, (error, userData) => {
      if (!error && userData) {
        tokenVerifier.matchTokenAndPhone(tokenId, phone, (isMatching) => {
          if (isMatching) {
            delete userData.encryptedPassword
            callback(false, userData)
          } else {
            callback({ error: 'invalid token, unauthorized' }, null)
          }
        })
      } else {
        callback(error, null)
      }
    })
  },
  updateUser: (phone, fields, callback) => {
    userRepository.read(phone, (error, userData) => {
      if (!error && userData) {
        if (fields.firstName) {
          userData.firstName = fields.firstName
        }
        if (fields.lastName) {
          userData.lastName = fields.lastName
        }
        if (fields.password) {
          userData.encryptedPassword = encryptor.encrypt(fields.password)
        }
        userRepository.update(userData, callback)
      } else {
        callback(error)
      }
    })
  },
  deleteUser: (phone, callback) => {
    userRepository.read(phone, (error, userData) => {
      if (!error && userData) {
        userRepository.delete(userData.phone, (error) => {
          if (!error) {
            var userCheckIds = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []
            var nChecksToDelete = userCheckIds.length
            if (0 < nChecksToDelete) {
              var nChecksDeleted = 0
              var deletionErrors = []
              userCheckIds.forEach((checkId) => {
                checkRepository.delete(checkId, (error) => {
                  if (error) {
                    deletionErrors.push(error)
                  }
                  nChecksDeleted++;
                  if (nChecksDeleted == nChecksToDelete) {
                    if (!deletionErrors.length) {
                      callback(false)
                    } else {
                      callback({ deletionErrors })
                    }
                  }
    
                })
              })
            } else {
              callback(false)
            }
          } else {
            callback(error)
          }
        })
      } else {
        callback(error)
      }
    })
  },
}

module.exports = userService