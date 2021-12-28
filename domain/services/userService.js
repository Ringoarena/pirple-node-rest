var userRepository = require('../../repositories/userRepository')
var checkRepository = require('../../repositories/checkRepository')

var userService = {
  createUser: (userData, callback) => {
    userRepository.create(userData, callback)
  },
  getUserByPhone: (phone, callback) => {
    userRepository.read(phone, callback)
  },
  updateUser: (userData, callback) => {
    userRepository.update(userData, callback)
  },
  deleteUser: (userData, callback) => {
    userRepository.delete(userData, (error) => {
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
  },
}

module.exports = userService