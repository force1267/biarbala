
const randomString = require('./random-string')
const genRandomTXT = () => randomString(120)

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
        
        console.log("DBG", name, path, password, domain, named)

        // if a name in a NAME file requested
        if(named) {
            console.log("DBG name requested", named)
            // todo validate name
            if(named.length < 8 || named.length > 20 || /^[azAZ0-9-]*$/.test(named) === false) {
                await rmrf(path)
                console.log("DBG name not allowed", named)
                throw "name is not valid"
            }
            console.log("DBG name was valid", named)
            // if a deployment with requested name existed
            if(await exists(namedPath)) {
                console.log("DBG name existed", named, namedPath)
                let namedPassword = await readFile(`${namedPath}PASSWORD`)
                // if existed deployment is password protected and password matches
                // user can not take a deployment that is not password protected.
                // they should wait for the name
                if(namedPassword && namedPassword === password) {
                    console.log("DBG good password", named)
                    await rmrf(namedPath)
                } else {
                    console.log("DBG bad password", named)
                    await rmrf(path)
                    throw "password is incorrect"
                }
            }
            // rename the deployment
            await rename(path, namedPath)
            console.log("DBG renamed", name, named)
            name = named
            path = namedPath
        }

        // if a domain-set is requested
        if (domain) {

            console.log("DBG domain requested", name, domain)

            let domainPath = `${cwd}/data/${domain}.domain.json`

            let domainJson = await readFile(domainPath)

            // if domain claim existed before
            if(domainJson) {
                console.log("DBG domain existed", name, domain)
                let old = JSON.parse(oldJson)

                console.log("DBG old domain", domain, domainJson)
                // if old domain claim was checked
                if(old.checked) {

                    console.log("DBG domain was checked", domain)
                    // if password for old deployment was wrong
                    if(old.password && site.password !== old.password) {

                        console.log("DBG password incorrect", domain)
                        throw "password is incorrect"
                    }

                    // remove old rename new to old name
                    let oldPath = `${cwd}/data/${old.name}`
                    await rmrf(oldPath)
                    // if it a name was requested 
                    if(old.name !== name) {
                        if(named) {
                            old.name = name
                            await rmrf(domainPath)
                            await writeFile(domainPath, JSON.stringify(old))
                            console.log("DBG domain file changed", old)
                        } else {
                            await rename(path, oldPath)
                            console.log("DBG it wasnt named so renamed", path, oldPath)
                        }
                    }
                    req.site = {
                        name,
                        domain
                    }
                    return await addDomain(domain);
                } else {
                    // existed domain was not checked by TXT record
                    // in this case checking password is not required
                    // so random users shouldn't be able to park others domains
                    // just remove unchecked domain claim
                    await rmrf(domainPath)
                    console.log("DBG not checked domain requested. removing", domain)
                }
            }

            // users will get TXT record to add to their DNS and then request a TXT check
            let txt = genRandomTXT()
            
            console.log("DBG TXT generated", domain, txt)
            // make an unchecked domain claim
            await writeFile(domainPath, JSON.parse({
                name,
                password,
                txt, // so user can prove domain ownership
                checked: false // is domain owend by user
            }))

            req.site = {
                name,
                domain,
                password: password ? true : false,
                txt
            }

            await addDomain(domain)
        } else {
            console.log("DBG no domain request", name)
            req.site = {
                name
            }
        }
    })()
    .then(next)
    .catch(err => {
        console.error(err.toString())
        return res.status(500).json("we couldn't save the site")
    })
}

module.exports = save