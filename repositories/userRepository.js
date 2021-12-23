var DAL = require('../lib/dataAbstractionLayer')

var userRepository = {
  directory: 'users',

  create: (userData, callback) => {
    DAL.create(userRepository.directory, userData.phone, userData, callback)
  },
  read: (phone, callback) => {
    DAL.read(userRepository.directory, phone, callback)
  },
  update: (userData, callback) => {
    DAL.update(userRepository.directory, userData.phone, userData, callback)
  },
  delete: (userData, callback) => {
    DAL.delete(userRepository.directory, userData.phone, callback)
  },
}

module.exports = userRepository