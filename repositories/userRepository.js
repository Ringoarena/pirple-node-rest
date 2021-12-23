var DAL = require('../lib/dataAbstractionLayer')

var userRepository = {
  directory: 'users',

  create: (userData, callback) => {
    DAL.create(userRepository.directory, `${userData.phone}`, userData, (error) => {
      callback(error)
    })
  },
  read: (phone, callback) => {
    DAL.read(userRepository.directory, `${phone}`, (error, data) => {
    callback(error, data)
})
  },
  update: (userData, callback) => {
    DAL.update(userRepository.directory, `${userData.phone}`, userData, (error) => {
      callback(error)
    })
  },
  delete: (userData, callback) => {
    DAL.delete(userRepository.directory, `${userData.phone}`, (error) => {
      callback(error)
    })
  },
}

module.exports = userRepository