const fs = require('fs')

const promised = require('../promised')
const readFile = promised(fs.readFile, true) // no throw readFile

module.exports = async path => {
    let data = await readFile(path)
    if(data) {
        return data.toString()
    }
}