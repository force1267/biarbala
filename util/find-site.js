const readFile = require('./fs/readFile')

const cwd = process.cwd()
const sites = `${cwd}/data`

const subdomain = (req, res, next) => {
    if(req.hostname.endsWith("biarbala.ir")) {
        let sds = req.subdomains
        req.site = (sds.length === 1) ? sds[0] : null
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
            } else {
                req.site = "www"
            }
        }
        return next()
    })()
}

module.exports = { domain, subdomain }