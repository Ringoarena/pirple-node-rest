var checkRepository = require('../repositories/checkRepository')
var userRepository = require('../repositories/userRepository')
var config = require('../config')
var uuidGenerator = require('../lib/uuidGenerator')

var checkService = {
  createCheck: (phone, checkData, callback) => {
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
  }
}

module.exports = checkService