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
  delete: (tokenId, callback) => {
    DAL.delete(tokenRepository.directory, tokenId, callback)
  }
}

module.exports = tokenRepository