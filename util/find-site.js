const cors = require('cors')

const readFile = require('./fs/readFile')

const cwd = process.cwd()
const sites = `${cwd}/data`

const subdomain = (req, res, next) => {
    if(req.hostname.endsWith("biarbala.ir")) {
        let sds = req.subdomains
        if(sds.length === 1) {
            req.site = sds[0]
        } else if(sds.length === 0) {
            req.site = "www"
            return cors()(req, res, next)
        } else {
            req.site = null
        }
    }
    return next()
}

const domain = (req, res, next) => {
    return (async () => {
        if(!req.site) {
            let domain = req.hostname
            let file = await readFile(`${sites}/${domain}.domain.json`)
            if(file) {
                let site = JSON.parse(file)
                req.site = site.name
            }
        }
        return next()
    })()
}

module.exports = { domain, subdomain }