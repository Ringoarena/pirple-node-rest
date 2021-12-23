const userService = require('../services/userService')

const handlers = {
  post: (data, callback) => {
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length ? data.payload.firstName.trim() : false
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length ? data.payload.lastName.trim() : false
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false
    let inputIsValid = firstName && lastName && phone && password && tosAgreement
    if (inputIsValid) {
      userService.getUserByPhone(phone, (error, userData) => {
        if (error) {
          var encryptedPassword = userService.encrypt(password);
          if (encryptedPassword) {
            var userData = {
              firstName,
              lastName,
              phone,
              encryptedPassword,
              tosAgreement
            }
            userService.createUser(userData, (error) => {
              if (!error) {
                callback(201)
              } else {
                callback(500, { error: 'Could not create user'})
              }
            })
          } else {
          callback(500, { error: 'Could not encrypt the users password'})
          }
        } else {
        callback(400, { error: 'A user with that phone number already exists'})
        }
      })
    } else {
    callback(400, {Error: 'missing required fields'})
    }
  },
  // @TODO only let authenticated users get their data
  get: (data, callback) => {
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone : false
    if (phone) {
      userService.getUserByPhone(phone, (error, userData) => {
        if (!error && userData) {
          delete userData.encryptedPassword
          callback(200, userData)
        } else {
          callback(404)
        }
      })
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
  // @TODO only let authenticated users update their data
  put: (data, callback) => {
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone : false
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length ? data.payload.firstName.trim() : false
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length ? data.payload.lastName.trim() : false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
    if (phone) {
      if (firstName || lastName || password) {
        userService.getUserByPhone(phone, (error, userData) => {
          if (!error && userData) {
            if (firstName) {
              userData.firstName = firstName
            }
            if (lastName) {
              userData.lastName = lastName
            }
            if (password) {
              userData.encryptedPassword = userService.encrypt(password);
            }
            userService.updateUser(userData, (error) => {
              if (!error) {
                callback(200)
              } else {
                console.log(error)
                callback(500, { error: 'could not update user'})
              }
            })
          } else {
            callback(404, { error: 'user not found'})
          }
        })
      } else {
        callback(400, { error: 'missing fields to update'})
      }
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
  // @TODO only let authenticated users delete their data
  delete: (data, callback) => {
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone : false
    if (phone) {
      userService.getUserByPhone(phone, (error, userData) => {
        if (!error && userData) {
          userService.deleteUser(userData, (error) => {
            if (!error) {
              callback(200)
            } else {
              callback(500, { error: 'could not delete the specified user'})
            }
          })
        } else {
          callback(404, { error: 'could not find the specified user'})
        }
      })
    } else {
      callback(400, { error: 'missing required field'})
    }
  },
}

var mapRouteToHandler = {
  users: (data, callback) => {
    if(Object.keys(handlers).includes(data.method)) {
      let handler = handlers[data.method]
      handler(data, callback)
    } else {
      callback(405)
    }
  }
}

module.exports = mapRouteToHandler