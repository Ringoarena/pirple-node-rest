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
  }
}

module.exports = checkService