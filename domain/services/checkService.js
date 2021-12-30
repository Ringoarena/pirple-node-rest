var checkRepository = require('../../repositories/checkRepository')
var userRepository = require('../../repositories/userRepository')
var tokenRepository = require('../../repositories/tokenRepository')
var config = require('../../config')
var uuidGenerator = require('../../lib/uuidGenerator')
var tokenVerifier = require('../model/tokenVerifier')

var checkService = {
  createCheck: (tokenId, checkData, callback) => {
    tokenRepository.read(tokenId, (error, tokenData) => {
      if (!error && tokenData) {
        var phone = tokenData.phone
        userRepository.read(phone, (error, userData) => {
          if (!error && userData) {
            var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []
            if (userChecks.length < config.maxChecks) {
              var newCheck = {
                id: uuidGenerator.generate(),
                userPhone: phone,
                ...checkData
              }
              checkRepository.create(newCheck, (error) => {
                if (!error) {
                  userData.checks = userChecks
                  userData.checks.push(newCheck.id)
                  userRepository.update(userData, (error) => {
                    if (!error) {
                      callback(false, newCheck)
                    } else {
                      callback(error)
                    }
                  })
                } else {
                  callback(error)
                }
              })
            } else {
              callback({ error: `check limit of ${config.maxChecks} reached` })
            }
          } else {
            callback(error)
          }
        })
      } else {
        callback({ message: 'invalid token' })
      }
    })
  },
  getCheckById: (checkId, tokenId, callback) => {
    checkRepository.read(checkId, (error, checkData) => {
      if (!error && checkData) {
        tokenVerifier.verify(tokenId, checkData.userPhone, (tokenIsValid) => {
          if (tokenIsValid) {
            callback(null, checkData)
          } else {
            callback({ error: 'invalid token' })
          }
        })
      } else {
        callback(error)
      }
    })
  },
  updateCheck: (checkId, tokenId, fields, callback) => {
    checkRepository.read(checkId, (error, checkData) => {
      if (!error && checkData) {
        tokenVerifier.verify(tokenId, checkData.userPhone, (tokenIsValid) => {
          if (tokenIsValid) {
            if (fields.protocol) {
              checkData.protocol = fields.protocol
            }
            if (fields.url) {
              checkData.url = fields.url
            }
            if (fields.method) {
              checkData.method = fields.method
            }
            if (fields.successCodes) {
              checkData.successCodes = fields.successCodes
            }
            if (fields.timeoutSeconds) {
              checkData.timeoutSeconds = fields.timeoutSeconds
            }
            checkRepository.update(checkData, callback)
          } else {
            callback({ error: 'invalid token' })
          }
        })
      } else {
        callback(error)
      }
    })
  },
  deleteCheck: (checkId, tokenId, callback) => {
    checkRepository.read(checkId, (error, checkData) => {
      if (!error && checkData) {
        tokenVerifier.verify(tokenId, checkData.userPhone, (tokenIsValid) => {
          if (tokenIsValid) {
            checkRepository.delete(checkData.id, (error) => {
              if (!error) {
                userRepository.read(checkData.userPhone, (error, userData) => {
                  if (!error && userData) {
                    var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []
                    var checkIndex = userChecks.indexOf(checkData.id)
                    if (-1 < checkIndex) {
                      userChecks.splice(checkIndex, 1)
                      userRepository.update(userData, callback)
                    } else {
                      callback({ error: 'checkId not found on user' })
                    }
                  } else {
                    callback(error)
                  }
                })
              } else {
                callback(error)
              }
            })
          } else {
            callback({ error: 'invalid token' })
          }
        })
      } else {
        callback(error)
      }
    })
  }
}

module.exports = checkService


