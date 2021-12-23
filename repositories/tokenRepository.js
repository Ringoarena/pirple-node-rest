var DAL = require('../lib/dataAbstractionLayer')

var tokenRepository = {
  directory: 'tokens',

  create: (tokenData, callback) => {
    DAL.create(tokenRepository.directory, `${tokenData.id}`, tokenData, callback)
  },
}

module.exports = tokenRepository