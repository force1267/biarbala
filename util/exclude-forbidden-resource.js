function excluder(req, res, next) {
    if([
        "PASSWORD",
        "DOMAIN",
        "NAME",
        "KEY",
        "CERT",
        "CA"
    ].includes(req.resource.toUpperCase()) || req.resource[0] === ".") {
        req.resource = null
    }
    return next()
}

module.exports = excluder