const exists = require('./fs/exists')
const static = require('serve-static')

const cwd = process.cwd()
const sites = `${cwd}/data`

function serve(req, res) {
    let site;
    if(req.site) {
        site = `${sites}/${req.site}`
    } else {
        return res.statu(500).send('we couldn,t find the site')
    }

    return (async () => {
        // if resource is forbidden (like DOMAIN) or not found
        let allowed = req.resource
        let found = false
        try {
            found = await exists(`${site}/${req.resource}`)
        } catch (err) {
            console.error(err)
        }
        if(!allowed || !found) {
            // if local 404.html exists else gobal 404 will be served
            if(await exists(`${site}/404.html`)) {
                return res.status(404).sendFile(`${site}/404.html`)
            } else {
                return res.status(404).sendFile(`${sites}/www/404.html`)
            }
        }
        
        // serve the resource
        return static(site)(req, res)
    })()
}

module.exports = serve