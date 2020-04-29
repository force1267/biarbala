// const axios = require('axios').default

// const {
//     redbird_domain_register_port = 8081,
// } = process.env

// async function add(domain) {
//     let data = await axios.get(`http://localhost:${redbird_domain_register_port}/${domain}`)
//     return data === "ok"
// }

// module.exports = add

const cwd = process.cwd()
const {
    acme_server = 'staging' // 'production'
} = process.env;

const Greenlock = require('@root/greenlock')
const greenlock = Greenlock.create({
    version: 'draft-12',
    server: `https://acme${acme_server === "staging" ? "-staging" : ''}-v02.api.letsencrypt.org/directory`,
    maintainerEmail: "force1267@gmail.com",
    agreeTos: true,
    packageAgent: "biarbala.ir/0.2.0",
    packageRoot: cwd,
    configDir: `${cwd}/greenlock.d`
})

// 'greenlock'
// async function add(domain) {
//     let results = await greenlock.check({ domains: [ domain ] })
//     if(!results) {
//         return await greenlock.register({
//             domains: [domain],
//             email: 'force1267@gmail.com',
//             agreeTos: true
//         })
//     }
// }

// @root/greenlock
async function add(domain) {
    let results = await greenlock.get({ servername: domain })
    if(!results) {
        return await greenlock.add({
            subject: domain,
            altnames: [domain],
            // email: 'force1267@gmail.com',
            // agreeTos: true
        })
    }
}

module.exports = { add } // { add, get, remove, greenlock }