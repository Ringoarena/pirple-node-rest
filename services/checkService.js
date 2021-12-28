var config = require('../config')
var checkRepository = require('../repositories/checkRepository')
var userService = require('./userService')
var uuidGenerator = require('../lib/uuidGenerator')

var checkService = {
  createCheck: (phone, checkData, callback) => {
    userService.getUserByPhone(phone, (error, userData) => {
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
              userService.updateUser(userData, (error) => {
                if (!error) {
                  callback(false, newCheck)
                } else {
                  callback({ error: 'could not update userData.checks' })
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
  },
  getCheckById: (id, callback) => {
    checkRepository.read(id, callback)
  },
  updateCheck: (checkData, callback) => {
    checkRepository.update(checkData, callback)
  },
  deleteCheck: (checkData, callback) => {
    checkRepository.delete(checkData.id, (error) => {
      if (!error) {
        userService.getUserByPhone(checkData.userPhone, (error, userData) => {
          if (!error && userData) {
            var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : []
            var checkIndex = userChecks.indexOf(checkData.id)
            if (-1 < checkIndex) {
              userChecks.splice(checkIndex, 1)
              userService.updateUser(userData, callback)
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
  },
  deleteUserChecks: (userData, callback) => {
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
          nChecksDeleted++
          if (!deletionErrors) {
            callback(false)
          } else {
            callback({ deletionErrors: deletionErrors })
          }
        })
      })
    } else {
      callback(false)
    }
  }
}

module.exports = checkService


