
const randomString = require('./random-string')
const genRandomTXT = () => randomString(20)

const { add: addDomain } = require('./domains')

// async fs
const readFile = require('./fs/readFile') // no throw readFile
const writeFile = require('./fs/writeFile')
const rmrf = require('./fs/rmrf')
const rename = require('./fs/rename')
const exists = require('./fs/exists')

const cwd = process.cwd()

function save(req, res, next) {
    // NAME for selecting the name (8-20 chars with azAZ09-)
    // DOMAIN to serve over users domain
    // PASSWORD for accessing deployment
    // KEY for ssl
    // CERT for ssl
    // CA for ssl
    // above files wont be served

    // 404.html will be served when 404 happens
    // index.html will be served

    (async () => {
        let name = req.siteName
        let path = req.uploadPath

        let password = await readFile(`${path}PASSWORD`)
        let domain = await readFile(`${path}DOMAIN`)

        let named = await readFile(`${path}NAME`)

        let namedPath = path.replace(name, named)
        

        // if a name in a NAME file requested
        if(named) {
            // todo validate name
            if(named.length < 8 || named.length > 20 || /^[\d|\w|-]+$/.test(named) === false) {
                await rmrf(path)
                throw "name is not valid"
            }
            // if a deployment with requested name existed
            if(await exists(namedPath)) {
                let namedPassword = await readFile(`${namedPath}PASSWORD`)
                // if existed deployment is password protected and password matches
                // user can not take a deployment that is not password protected.
                // they should wait for the name
                if(namedPassword && namedPassword === password) {
                    await rmrf(namedPath)
                } else {
                    await rmrf(path)
                    throw "password is incorrect"
                }
            }
            // rename the deployment
            await rename(path, namedPath)
            name = named
            path = namedPath
        }

        // if a domain-set is requested
        if (domain) {
            let domainPath = `${cwd}/data/${domain}.domain.json`
            let domainJson = await readFile(domainPath)

            // if domain claim existed before
            if(domainJson) {
                let old = JSON.parse(domainJson)

                // if old domain claim was checked
                if(old.checked) {

                    // if password for old deployment was wrong
                    let oldPassword = await readFile(`${cwd}/data/${old.name}/PASSWORD`)
                    if(oldPassword && password !== oldPassword) {

                        throw "password is incorrect"
                    }

                    // remove old rename new to old name
                    let oldPath = `${cwd}/data/${old.name}`
                    await rmrf(oldPath)
                    // if a name was requested 
                    if(old.name !== name) {
                        if(named) {
                            // a name was choosen by user
                            // so change the existed domain claim
                            // to point to this newly choosen name
                            old.name = name
                            await rmrf(domainPath)
                            await writeFile(domainPath, JSON.stringify(old))
                        } else {
                            // a random name was choosen. not by user
                            // so just change it to old deployment name
                            await rename(path, oldPath)
                        }
                    }
                    req.site = {
                        name,
                        domain
                    }
                    addDomain(domain) // do not await ! do not return
                    return;
                } else {
                    // existed domain was not checked by TXT record
                    // in this case checking password is not required
                    // so random users shouldn't be able to park others domains
                    // just remove unchecked domain claim
                    await rmrf(domainPath)
                }
            }

            // users will get TXT record to add to their DNS and then request a TXT check
            let txt = genRandomTXT()
            
            // make an unchecked domain claim
            await writeFile(domainPath, JSON.stringify({
                name,
                txt, // so user can prove domain ownership
                checked: false // is domain owend by user
            }))

            req.site = {
                name,
                domain,
                password: password ? true : false,
                txt
            }

            addDomain(domain) // do not await ! do not return
            return;
        } else {
            req.site = {
                name
            }
        }
    })()
    .then(next)
    .catch(err => {
        if(typeof err === 'string') {
            return res.status(401).json({err})
        }
        console.error(err)
        return res.status(500).json({err: "we couldn't save the site"})
    })
}

module.exports = save