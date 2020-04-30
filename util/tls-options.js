const fs = require('fs')
const tls = require('tls')
const greenlock = require('./greenlock')
const readFile = require('./fs/readFile')
const writeFile = require('./fs/writeFile')

const cwd = process.cwd()
const data = `${cwd}/data`

function SNICallback(servername, cb) {
    if(servername.endsWith("biarbala.ir")) { // certs are in www. no need to check
        // biarbala certs
        cb(null, null)
    } else {
        (async () => {
            let domain = await readFile(`${data}/${servername}.domain.json`)
            // domain exists
            if(domain) {
                let site = JSON.parse(domain)
                let name = site.name
                let cert = await readFile(`${data}/${name}/CERT`)
                // if CERT and KEY and maybe CA exists
                if(cert) {
                    let key = await readFile(`${data}/${name}/KEY`)
                    if(key) {
                        // use uploaded pems
                        let ca = await readFile(`${data}/${name}/CA`)
                        let ctx = tls.createSecureContext({ cert, key, ca })
                        return cb(null, ctx)
                    }
                }
                // if pems not uploaded see if LetsEncrypt pems exist
                let pems = await greenlock.get({ servername })
                if(pems) {
                    // write pems to file for next time
                    await writeFile(`${data}/${name}/CERT`, pems.cert)
                    await writeFile(`${data}/${name}/KEY`, pems.key)
                    // use LetsEncrypt
                    let ctx = tls.createSecureContext(pems)
                    return cb(null, ctx)
                }
            }
            // domain is not on the system
            cb(null, null)
        })()
        .catch(error => {
            console.error(error)
            cb(error)
        })
    }
}

const tlsOptions = {
    SNICallback,
    cert: fs.readFileSync(`${data}/www/CERT`),
    key: fs.readFileSync(`${data}/www/KEY`)
}

module.exports = tlsOptions