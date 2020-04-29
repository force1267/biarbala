const greenlock = require('./greenlock')

async function add(domain) {
    let results = await greenlock.get({ servername: domain })
    if(results) {
        return results
    } else {
        return await greenlock.add({
            subject: domain,
            altnames: [domain],
            // email: 'force1267@gmail.com',
            // agreeTos: true
        })
    }
}

async function get(domain) {
    let site = await greenlock.get({ servername: domain })
    if(!site) {
        return null
    }
    return {
        cert: site.pems.cert + '\n' + site.pems.chain + '\n',
        key: site.pems.privkey
    }
}

module.exports = { add, get } // { add, get, remove }