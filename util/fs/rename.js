const fs = require('fs')

const promised = require('../promised')
const rename = promised(fs.rename)

module.exports = rename