const axios = require('axios').default

const {
    redbird_domain_register_port = 8081,
} = process.env

async function add(domain) {
    let data = await axios.get(`http://localhost:${redbird_domain_register_port}/${domain}`)
    return data === "ok"
}

module.exports = add