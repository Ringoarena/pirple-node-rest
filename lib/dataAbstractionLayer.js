var fs = require('fs')
var path = require('path')
const parser = require('../utilities/parser')

var dataAbstractionLayer = {
  baseDir: path.join(__dirname,'/../.data/'),
  create: (dir, file, data, callback) => {
    fs.open(`${dataAbstractionLayer.baseDir}${dir}/${file}.json`, 'wx', (error, fileDescriptor) => {
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
    fs.readFile(`${dataAbstractionLayer.baseDir}${dir}/${file}.json`, 'utf8', (error, data) => {
      if (!error && data) {
        var parsedData = parser.jsonToObject(data)
        callback(false, parsedData)
      } else {
        callback(error, null)
      }
    })
  },
  update: (dir, file, data, callback) => {
    fs.open(`${dataAbstractionLayer.baseDir}${dir}/${file}.json`, 'r+', (error, fileDescriptor) => {
      if (!error, fileDescriptor) {
        var stringData = JSON.stringify(data)
        fs.ftruncate(fileDescriptor, (error) => {
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
    fs.unlink(`${dataAbstractionLayer.baseDir}${dir}/${file}.json`, (error) => {
      if (!error) {
        callback(false)
      } else {
        callback('There was an error deleting the file')
      }
    })
  }
}

module.exports = dataAbstractionLayer