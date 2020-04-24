const fs = require('fs')

async function exists(file) {
    return await new Promise(resolve => {
        fs.exists(file, isthere => {
            resolve(isthere)
        })
    })
}

module.exports = exists