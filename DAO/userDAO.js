var _data = require('../lib/data')

var userDAO = {
  folderName: 'users',
  fileCounter: 0,
  nextFileName: () => {
    userDAO.fileCounter++;
    return `user${userDAO.fileCounter}`
  },
  create: (userData) => {
    _data.create(userDAO.folderName, userDAO.nextFileName(), userData, (error) => {
      console.error('ERROR: ', error)
    })
  },
  read: (fileNumber) => {
    _data.read(userDAO.folderName, `user${fileNumber}`, (e, d) => {
    console.log('E:', e)
    console.log('D:', d)
})
  },
  update: (fileNumber, userData) => {
    _data.update(userDAO.folderName, `user${fileNumber}`, userData, (error) => {
      console.log('E: ', error)
    })
  },
  delete: (fileNumber) => {
    _data.delete(userDAO.folderName, `user${fileNumber}`, (error) => {
      console.log('E: ', error)
    })
  },
}

module.exports = userDAO