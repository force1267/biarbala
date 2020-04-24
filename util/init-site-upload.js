
const getRandomName = require('./random-name')

const cwd = process.cwd()

const init = (req, res, next) => {
    let name = getRandomName()
    req.siteName = name
    req.uploadPath = `${cwd}/data/${name}/`
    return next()
}

module.exports = init