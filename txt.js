
const dig = require('node-dig-dns')

const app = require('./util/express-app')

const readFile = require('./util/fs/readFile')
const writeFile = require('./util/fs/writeFile')
const rmrf = require('./util/fs/rmrf')

const cwd = process.cwd()
const data = `${cwd}/data`

app.get('/txt/:domain', (req, res, next) => {
    if(!req.hostname.endsWith("biarbala.ir") || req.subdomains.length !== 0) {
        return next()
    }
    

    let domain = req.params.domain
    let domainFile = `${data}/${domain}.domain.json`
    return (async () => {
        let file = await readFile(domainFile)
        if(file) {
            let claim = JSON.parse(file)
            if(!claim.checked) {
                let result = await dig(["TXT", domain])
                let checked = result.answer.filter(record => record.type === "TXT")
                .map(record => record.value)
                .map(value => {
                    if(value[0] === '"' && value.endsWith('"')) {
                        return value.slice(1, value.length - 1)
                    } else {
                        return value
                    }
                })
                .includes(claim.txt)
                
                if(checked) {
                    claim.checked = true
                    await rmrf(domainFile)
                    await writeFile(domainFile, JSON.stringify(claim))
                    return res.send("domain checked")
                } else {
                    return res.status(404).send("TXT was not found in records")
                }
            } else {
                return res.send("domain checked")
            }
        } else {
            return res.status(409).send("domain is not claimed")
        }
    })().catch(err => {
        console.error(err)
        res.status(500).send("we couldn't check the domain")
    })
})