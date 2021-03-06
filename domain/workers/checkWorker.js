var https = require('https')
var http = require('http')
var url = require('url')
var util = require('util')
var checkRepository = require('../../repositories/checkRepository')
var twilioClient = require('../../serviceClients/twilioClient')
var fLogger = require('../../lib/fLogger')

var debug = util.debuglog('workers')
console.log(debug.enabled)

var checkWorker = {
  start: () => {
    checkWorker.gatherChecks()
    checkWorker.loop()
    checkWorker.rotateLogs()
    checkWorker.logRotationLoop()
    console.log('\x1b[33m%s\x1b[0m', 'check worker started')
  },
  gatherChecks: () => {
    checkRepository.list((error, checkIds) => {
      if (!error && checkIds && checkIds.length > 0) {
        checkIds.forEach((checkId) => {
          checkRepository.read(checkId, (error, checkData) => {
            if (!error && checkData) {
              var isValid = checkWorker.validateCheckData(checkData)
              if (isValid) {
                checkWorker.performCheck(checkData)
              } else {
                console.log('Error, one of the checks is not properly formatted, skipping it. Check: ', checkData)
              }
            } else {
              console.log('Error reading one of the checks data. Error: ', error)
            }
          })
        })
      } else {
        console.log('Could not find any checks to process. Error: ', error)
      }
    })
  },
  validateCheckData: (checkData) => {
    checkData = typeof(checkData) == 'object' && checkData !== null ? checkData : {}
    checkData.id = typeof(checkData.id) == 'string' && checkData.id.trim().length ? checkData.id.trim() : false
    checkData.userPhone = typeof(checkData.userPhone) == 'string' && checkData.userPhone.trim().length ? checkData.userPhone.trim() : false
    checkData.protocol = typeof(checkData.protocol) == 'string' && ['http', 'https'].indexOf(checkData.protocol) > -1 ? checkData.protocol.trim() : false
    checkData.url = typeof(checkData.url) == 'string' && checkData.url.trim().length ? checkData.url.trim() : false
    checkData.method = typeof(checkData.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(checkData.method) > -1 ? checkData.method.trim() : false
    checkData.successCodes = typeof(checkData.successCodes) == 'object' && checkData.successCodes instanceof Array && checkData.successCodes.length ? checkData.successCodes : false
    checkData.timeoutSeconds = typeof(checkData.timeoutSeconds) == 'number' && checkData.timeoutSeconds % 1 == 0 && checkData.timeoutSeconds <= 5 ? checkData.timeoutSeconds : false
    checkData.state = typeof(checkData.state) == 'string' && ['up', 'down'].indexOf(checkData.state) > -1 ? checkData.state : 'down'
    checkData.lastChecked = typeof(checkData.lastChecked) == 'number' && checkData.lastChecked > 0 ? checkData.lastChecked : false
    var isValid = !!(checkData.id && checkData.userPhone && checkData.protocol && checkData.url && checkData.method && checkData.successCodes && checkData.timeoutSeconds)
    return isValid
  },
  performCheck: (checkData) => {
    var outcome = {
      error: false,
      responseCode: false
    }
    var outcomeSent = false
    var parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true)
    var hostName = parsedUrl.hostname
    var path = parsedUrl.path
    var requestDetails = {
      protocol: `${checkData.protocol}:`,
      hostname: hostName,
      method: checkData.method.toUpperCase(),
      path: path,
      timeout: checkData.timeoutSeconds * 1000,
    }
    var moduleToUse = checkData.protocol == 'http' ? http : https
    var request = moduleToUse.request(requestDetails, (response) => {
      const status = response.statusCode
      outcome.responseCode = status
      if (!outcomeSent) {
        checkWorker.processCheckOutcome(checkData, outcome)
        outcomeSent = true
      }
    })
    request.on('error', (error) => {
      outcome.error = {
        error: true,
        value: error
      }
      if (!outcomeSent) {
        checkWorker.processCheckOutcome(checkData, outcome)
        outcomeSent = true
      }
    })
    request.on('timeout', () => {
      outcome.error = {
        error: true,
        value: 'timeout'
      }
      if (!outcomeSent) {
        checkWorker.processCheckOutcome(checkData, outcome)
        outcomeSent = true
      }
    })
    request.end()
  },
  processCheckOutcome: (checkData, outcome) => {
    var state = !outcome.error && outcome.responseCode && checkData.successCodes.indexOf(outcome.responseCode) > -1 ? 'up' : 'down'
    var alertWarranted = checkData.lastChecked && checkData.state !== state ? true : false
    checkData.state = state
    checkData.lastChecked = Date.now()
    checkWorker.logCheck(checkData, outcome, state, alertWarranted, checkData.lastChecked)
    checkRepository.update(checkData, (error) => {
      if (!error) {
        if (alertWarranted) {
          checkWorker.alertUser(checkData)
        } else {
          console.log('Outcome has not changed, no alert needed for checkId: ', checkData.id)
        }
      } else {
        console.log('Could not update check, error: ', error)
      }
    })
  },
  alertUser: (checkData) => {
    var message = `Alert: your check for ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} is currently ${checkData.state}`
    twilioClient.sendTwilioSMS(checkData.userPhone, message, (error) => {
      if (!error) {
        console.log('message sent successfully, user was alerted')
      } else {
        console.log('message was not send successfully, user was not alerted. Error: ', error)
      }
    })
  },
  logCheck: (cd, outcome, state, alertWarranted, timestamp) => {
    var logData = {
      check: cd,
      outcome,
      state,
      alert: alertWarranted,
      time: timestamp
    }
    var logString = JSON.stringify(logData)
    var logFileName = cd.id
    fLogger.append(logFileName, logString, (e) => {
      if (!e) {
        console.log('Logging to file succeeded')
      } else {
        console.log('Logging to file failed')
      }
    })
  },
  rotateLogs: () => {
    fLogger.list(false, (e, logs) => {
      if (!e && logs && logs.length) {
        logs.forEach((logName) => {
          var logId = logName.replace('.log', '')
          var newFileId = `${logId}-${Date.now()}`
          fLogger.compress(logId, newFileId, (e) => {
            if (!e) {
              fLogger.truncate(logId, (e) => {
                if (!e) {
                  console.log('success truncating log file')
                } else {
                  console.log('error truncating log file')
                }
              })
            } else {
              console.log('error compressing one of the log files')
            }
          })
        })
      } else {
        console.log('error, could not find any logs')
      }
    })
  },
  logRotationLoop: () => {
    setInterval(() => {
      console.log('process.env.DEBUG: ', process.env.DEBUG)
      console.log('process.env.NODE_DEBUG: ', process.env.NODE_DEBUG)
      checkWorker.rotateLogs()
    }, 1000 * 10)
  } ,
  loop: () => {
    setInterval(() => {
      checkWorker.gatherChecks()
    }, 1000 * 5)
  },

}

module.exports = checkWorker