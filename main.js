var httpServer = require('./web/servers/httpServer')
var httpsServer = require('./web/servers/httpsServer')
var checkWorker = require('./domain/workers/checkWorker')

httpServer.start()
httpsServer.start()
checkWorker.start()