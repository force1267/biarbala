
const dig = require('node-dig-dns')

const app = require('./util/express-app')

const readFile = require('./util/fs/readFile')
const writeFile = require('./util/fs/writeFile')
const rmrf = require('./util/fs/rmrf')

const cwd = process.cwd()
const data = `${cwd}/data`

app.post('/password/:name/:old/:new', (req, res) => {
    let name = req.params.name
    let path = `${data}/${name}`
    let passFile = `${path}/PASSWORD`
    let oldPass = req.params.old
    let newPass = req.params.new

    return (async () => {
        let password = await readFile(passFile)
        if(password && oldPass === password) {
            await rmrf(passFile)
            await writeFile(passFile, newPass)

            let domain = await readFile(`${path}/DOMAIN`)
            if(domain) {
                let domainFile = `${data}/${domain}.domain.json`
                let file = await readFile(domainFile)
                let claim = JSON.parse(file)
                claim.password = newPass
                await rmrf(domainFile)
                await writeFile(domainFile, JSON.stringify(claim))
            }
            return res.send("ok")
        } else {
            return res.status(401).send("password incorrect")
        }
    })().catch(err => {
        console.error(err)
        res.status(500).send("we couldn't reset the password")
    })
})