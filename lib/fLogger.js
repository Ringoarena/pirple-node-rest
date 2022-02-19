var fs = require('fs')
var path = require('path')
var zlib = require('zlib')

var fLogger = {
  baseDir: path.join(__dirname, '/../.logs/'),
  append: (fileName, logString, cb) => {
    fs.open(`${fLogger.baseDir}${fileName}.log`, 'a', (e, fileDescriptor) => {
      if (!e && fileDescriptor) {
        fs.appendFile(fileDescriptor, `${logString}\n`, (e) => {
          if (!e) {
            fs.close(fileDescriptor, (e) => {
              if (!e) {
                cb(false)
              } else {
                cb('error closing file')
              }
            })
          } else {
            cb('error appending to file')
          }
        })
      } else {
        cb('could not open file for appending')
      }
    })
  },
  list: (includeCompressed, cb) => {
    fs.readdir(fLogger.baseDir, (e, data) => {
      if (!e && data && data.length) {
        var trimmed = []
        data.forEach((fileName) => {
          if (fileName.indexOf('.log') > -1) {
            trimmed.push(fileName.replace('.log', ''))
          }
          if (fileName.indexOf('.gz.b64') > -1 && includeCompressed) {
            trimmed.push(fileName.replace('.gz.b64', ''))
          }
        })
        cb(false, trimmed)
      } else {
        cb(e, data)
      }
    })
  },
  compress: (logId, newFileId, cb) => {
    var sourceFile = `${logId}.log`
    var destFile = `${newFileId}.gz.b64`
    fs.readFile(`${fLogger.baseDir}${sourceFile}`, 'utf8', (e, inputString) => {
      if (!e && inputString) {
        zlib.gzip(inputString, (e, buffer) => {
          if (!e && buffer) {
            fs.open(`${fLogger.baseDir}${destFile}`, 'wx', (e, fileDescriptor) => {
              if (!e && fileDescriptor) {
                fs.writeFile(fileDescriptor, buffer.toString('base64'), (e) => {
                  if (!e) {
                    fs.close(fileDescriptor, (e) => {
                      if (!e) {
                        cb(false)
                      } else {
                        cb(e)
                      }
                    })
                  } else {
                    cb(e)
                  }
                })
              } else {
                cb(e)
              }
            })
          } else {
            cb(e)
          }
        })
      } else {
        cb(e)
      }
    })
  },
  decompress: (fileId, cb) => {
    var fileName = `${fileId}.gz.b64`
    fs.readFile(`${fLogger.baseDir}${fileName}`, 'utf8', (e, encodedString) => {
      if (!e && encodedString) {
        var inputBuffer = Buffer.from(encodedString, 'base64')
        zlib.unzip(inputBuffer, (e, outputBuffer) => {
          if (!e && outputBuffer) {
            var str = outputBuffer.toString()
            cb(false, str)
          } else {
            cb(e)
          }
        })
      } else {
        cb(e)
      }
    })
  },
  truncate: (logId, cb) => {
    fs.truncate(`${fLogger.baseDir}${logId}.log`, 0, (e) => {
      if (!e) {
        cb(false)
      } else {
        cb(e)
      }
    })
  }
}

module.exports = fLogger