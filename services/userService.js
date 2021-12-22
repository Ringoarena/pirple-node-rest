var userRepository = require('../repositories/userRepository')

var userService = {
  createUser: () => {
    console.log('userService.createUser')
  },
  getUserByPhone: (phone, callback) => {
    return userRepository.read(phone, (error, userData) => {
      callback(error, userData)
    })
  }
}

module.exports = userService