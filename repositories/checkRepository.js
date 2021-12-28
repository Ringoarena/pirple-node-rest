var DAL = require('../lib/dataAbstractionLayer')

var checkRepository = {
  directory: 'checks',

  create: (checkData, callback) => {
    DAL.create(checkRepository.directory, checkData.id, checkData, callback)
  },
  read: (id, callback) => {
    DAL.read(checkRepository.directory, id, callback)
  },
  update: (checkData, callback) => {
    DAL.update(checkRepository.directory, checkData.id, checkData, callback)
  },
  delete: (checkId, callback) => {
    DAL.delete(checkRepository.directory, checkId, callback)
  }
}

module.exports = checkRepository