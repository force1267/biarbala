
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

        let password = await readFile(`${path}/PASSWORD`)
        let domain = await readFile(`${path}/DOMAIN`)

        let named = await readFile(`${path}/NAME`)

        let namedPath = path.replace(name, named)

        // if a name in a NAME file requested
        if(named) {
            // todo validate name
            if(named.length < 8 || named.length > 20 || /^[azAZ0-9-]*$/.test(named) === false) {
                await rmrf(path)
                throw "name is not valid"
            }
            
            // if a deployment with requested name existed
            if(await exists(namedPath)) {
                let namedPassword = await readFile(`${namedPath}/PASSWORD`)
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

        const domainPath = `${cwd}/data/${domain}.domain.json`

        // if a domain-set is requested
        if (domain) {
            let domainJson = await readFile(domainPath)

            // if domain claim existed before
            if(domainJson) {
                let old = JSON.parse(oldJson)

                // if old domain claim was checked
                if(old.checked) {
                    // if password for old deployment was wrong
                    if(old.password && site.password !== old.password) {
                        throw "password is incorrect"
                    }
                    // remove old rename new to old name
                    await rmrf(old.path)
                    await rename(path, old.path)
                    req.site = {
                        name,
                        domain
                    }
                    return;
                // existed domain was not checked by TXT record
                } else {
                    // just remove unchecked domain claim
                    await rmrf(domainPath)
                }
            }

            // users will get TXT record to add to their DNS and then request a TXT check
            let txt = genRandomTXT()
            // let ssl = {
            //     key: await readFile(`${path}/KEY`) ? true : false,
            //     cert: await readFile(`${path}/CERT`) ? true : false,
            //     ca: await readFile(`${path}/CA`) ? true : false,
            // }
            
            // make an unchecked domain claim
            await writeFile(domainPath, JSON.parse({
                name,
                path,
                password,
                txt, // so user can prove domain ownership
                // ssl,
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
            req.site = {
                name
            }
        }
        // return await addDomain(`${name}.biarbala.ir`)
    })()
    .then(next)
    .catch(err => {
        console.error(err.toString())
        return res.status(500).json("we couldn't save the site")
    })
}

module.exports = save