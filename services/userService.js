var crypto = require('crypto');
var userRepository = require('../repositories/userRepository')
const checkService = require('./checkService');
var config = require('../config');

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
        checkService.deleteUserChecks(userData, (deletionErrors) => {
          if (!deletionErrors) {
            callback(false)
          } else {
            callback(deletionErrors)
          }
        })
      } else {
        callback(error)
      }
    })
  },
  encrypt: (str) => {
    if (typeof(str) == 'string' && str.length) {
      return crypto.createHmac('sha256', config.privateKey).update(str).digest('hex');
    } else {
      return false
    }
  }
}

module.exports = userService