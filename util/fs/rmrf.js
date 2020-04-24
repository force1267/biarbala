const rimraf = require('rimraf')

const promised = require('../promised')
const rmrf = promised(rimraf)

module.exports = rmrf