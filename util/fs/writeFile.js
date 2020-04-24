const fs = require('fs')

const promised = require('../promised')
const writeFile = promised(fs.writeFile)

module.exports = writeFile