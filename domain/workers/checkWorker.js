var path = require('path')
var fs = require('fs')
var https = require('https')
var http = require('http')
var url = require('url')
var checkRepository = require('../../repositories/checkRepository')

var checkWorker = {
  start: () => {}
}

module.exports = checkWorker