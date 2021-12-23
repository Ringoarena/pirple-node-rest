var crypto = require('crypto');
var userRepository = require('../repositories/userRepository')
var config = require('../config')

var userService = {
  createUser: (userData, callback) => {
    userRepository.create(userData, (error) => {
      callback(error)
    })
  },
  getUserByPhone: (phone, callback) => {
    userRepository.read(phone, (error, userData) => {
      callback(error, userData)
    })
  },
  updateUser: (userData, callback) => {
    userRepository.update(userData, (error) => {
      callback(error)
    })
  },
  deleteUser: (userData, callback) => {
    userRepository.delete(userData, (error) => {
      callback(error)
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