var crypto = require('crypto');
var userRepository = require('../repositories/userRepository')
var config = require('../config')

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
    userRepository.delete(userData, callback)
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