function resource(req, res, next) {
    let path = req.path.split('//').join('')
    let resource = path[0] === '/' ? path.slice(1) : path
    req.resource = resource || "index.html"
    return next()
}

module.exports = resource