var fs = require('fs')
var path = require('path')

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
                console.log(error)
                callback({ error: 'error closing new file'})
              }
            })
          } else {
            console.log(error)
            callback({ error: 'error writing to new file'})
          }
        })
      } else {
        console.log(error)
        callback({ error: `could not create ${data}`})
      }
    })
  },
  read: (dir, file, callback) => {
    fs.readFile(`${dataAbstractionLayer.baseDir}${dir}/${file}.json`, 'utf8', (error, data) => {
      if (!error && data) {
        var parsedData =  JSON.parse(data)
        callback(false, parsedData)
      } else {
        console.log(error)
        callback({ error: `could not read ${dir}/${file}`}, null)
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
                    console.log(error)
                    callback({ error: 'there was an error closing the file'})
                  }
                })
              } else {
                console.log(error)
                callback({ error: 'error writing to exising file'})
              }
            })
          } else {
            console.log(error)
            callback({ error: 'error truncating file'})
          }
        })
      } else {
        console.log(error)
        callback({ error: 'could not open the file for updating, it may not exist yet' })
      }
    })
  },
  delete: (dir, file, callback) => {
    fs.unlink(`${dataAbstractionLayer.baseDir}${dir}/${file}.json`, (error) => {
      if (!error) {
        callback(false)
      } else {
        console.log(error)
        callback({ error: 'there was an error deleting the file'})
      }
    })
  }
}

module.exports = dataAbstractionLayer