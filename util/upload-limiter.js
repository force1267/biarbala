const busboy = require('connect-busboy')

function limiter(megabytes) {
    return busboy({
        limits: {
            fileSize: megabytes * 1024 * 1024,
            files: 1,
        }
    })
}

module.exports = limiter