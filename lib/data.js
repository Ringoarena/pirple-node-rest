var fs = require('fs')
var path = require('path')

var lib = {
  baseDir: path.join(__dirname,'/../.data/'),
  create: (dir, file, data, callback) => {
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (error, fileDescriptor) => {
      if (!error && fileDescriptor) {
        var stringData = JSON.stringify(data)
        fs.writeFile(fileDescriptor, stringData, (error) => {
          if (!error) {
            fs.close(fileDescriptor, (error) => {
              if (!error) {
                callback(false)
              } else {
                callback('Error closing new file')
              }
            })
          } else {
            callback('Error writing to new file')
          }
        })
      } else {
        callback('Could not create new file, it may already exist')
      }
    })
  },
  read: (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (error, data) => {
      callback(error, data)
    })
  },
  update: (dir, file, data, callback) => {
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (error, fileDescriptor) => {
      if (!error, fileDescriptor) {
        var stringData = JSON.stringify(data)
        fs.truncate(fileDescriptor, (error) => {
          if (!error) {
            fs.writeFile(fileDescriptor, stringData, (error) => {
              if (!error) {
                fs.close(fileDescriptor, (error) => {
                  if (!error) {
                    callback(false)
                  } else {
                    callback('There was an error closing the file')
                  }
                })
              } else {
                callback('Error writing to exising file')
              }
            })
          } else {
            callback('Error truncating file')
          }
        })
      } else {
        callback('Could not open the file for updating, it may not exist yet')
      }
    })
  },
  delete: (dir, file, callback) => {
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (error) => {
      if (!error) {
        callback(false)
      } else {
        callback('There was an error deleting the file')
      }
    })
  }
}

module.exports = lib