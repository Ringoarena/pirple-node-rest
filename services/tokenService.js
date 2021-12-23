var tokenRepository = require ('../repositories/tokenRepository')

var uuid = () => {
  return Math.random().toString(16).slice(2)
}

var tokenService = {
  authenticate: (phone, callback) => {
    var tokenData = {
      id: uuid(),
      expires: Date.now() * 1000 * 60 * 60,
      phone
    }
    tokenRepository.create(tokenData, (error) => {
      if (error) {
        console.log(error)
        callback(error)
      } else {
        callback(false, tokenData)
      }
    })
  },
  getTokenById: (id, callback) => {
    tokenRepository.read(id, callback)
  },
  updateToken: (tokenData, callback) => {
    tokenRepository.update(tokenData, callback)
  },
  deleteToken: (tokenData, callback) => {
    tokenRepository.delete(tokenData, callback)
  }
}

module.exports = tokenService