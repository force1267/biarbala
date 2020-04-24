#!/usr/bin/env node
require('dotenv').config()

if(process.argv.includes('--with-proxy')) {
    require('./proxy')
}

const cluster = require('cluster')

const {
    app_workers = 1
} = process.env

if (cluster.isMaster) {
    for (var i = 0; i < app_workers; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.error({
            code: code,
            signal: signal,
        }, 'worker died un-expectedly... restarting it.');
        // Fork if a worker dies.
        cluster.fork();
    });
} else {
    const app = require('./util/express-app')

    require("./serve")
    require("./upload")
    require("./txt")
    require("./password")

    const {
        local_http_port = 8080,
        // local_https_port = 4433
    } = process.env

    app.listen(local_http_port)
}

