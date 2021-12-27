var DAL = require('../lib/dataAbstractionLayer')

var tokenRepository = {
  directory: 'tokens',

  create: (tokenData, callback) => {
    DAL.create(tokenRepository.directory, tokenData.id, tokenData, callback)
  },
  read: (tokenId, callback) => {
    DAL.read(tokenRepository.directory, tokenId, callback)
  },
  update: (tokenData, callback) => {
    DAL.update(tokenRepository.directory, tokenData.id, tokenData, callback)
  },
  delete: (tokenData, callback) => {
    DAL.delete(tokenRepository.directory, tokenData.id, callback)
  }
}

module.exports = tokenRepository