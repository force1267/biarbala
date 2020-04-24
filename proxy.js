#!/usr/bin/env node
const redbird = require('redbird')
const loadSites = require('./util/register-sites')

const {
    proxy_workers = 1,
    local_http_port = 8080,
    redbird_domain_register_port = 8081,
    http_port = 80,
    https_port = 443,
    letsencrypt_env = "dev" // "prod"
} = process.env

let proxy = redbird({
    port: http_port,
    cluster: proxy_workers,
    xfwd: true,
    letsencrypt: {
        path: __dirname + '/certs',
        // port: 9999 // default 3000
    },
    ssl: {
        http2: true,
        port: https_port,
    }
});

const register = (domain, ssl = {
    letsencrypt: {
        email: 'force1267@gmail.com',
        production: letsencrypt_env !== "dev",
    }
}) => proxy.register(domain, `http://localhost:${local_http_port}`, { ssl });

loadSites(register).catch(err => console.log("couldn't load all domains", err))

if(require('cluster').isMaster) {
    const app = require('./util/express-app.js')
    app.get("/:domain", (req, res) => {
        register(req.params.domain)
        res.send("ok")
    })
    app.listen(redbird_domain_register_port)
}