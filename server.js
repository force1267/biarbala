const http = require('http')
const spdy = require('spdy')
const redir = require('redirect-https')

const app = require('./util/express-app')

const middleware = require('./util/challenge-middleware')
const tlsOptions = require('./util/tls-options')


// app.listen(80)
// http.createServer(middleware(redir)).listen(80)
http.createServer(middleware(redir())).listen(80)
spdy.createServer(tlsOptions, app).listen(443)