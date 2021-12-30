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
  delete: (phone, callback) => {
    DAL.delete(userRepository.directory, phone, callback)
  },
}

module.exports = userRepository