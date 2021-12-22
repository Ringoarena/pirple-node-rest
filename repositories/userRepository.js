var _data = require('../lib/data')

var userRepository = {
  folderName: 'users',

  create: (userData, callback) => {
    _data.create(userRepository.folderName, `${userData.phone}.json`, userData, (error) => {
      callback(error)
    })
  },
  read: (phone, callback) => {
    _data.read(userRepository.folderName, `${phone}.json`, (error, data) => {
    callback(error, data)
})
  },
  update: (fileNumber, userData, callback) => {
    _data.update(userRepository.folderName, `user${fileNumber}`, userData, (error) => {
      callback(error)
    })
  },
  delete: (fileNumber, callback) => {
    _data.delete(userRepository.folderName, `user${fileNumber}`, (error) => {
      callback(error)
    })
  },
}

module.exports = userRepository