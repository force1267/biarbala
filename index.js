#!/usr/bin/env node
require('dotenv').config()

// if(process.argv.includes('--with-proxy')) {
//     require('./proxy')
// }

// const cluster = require('cluster')

// const {
//     app_workers = 1
// } = process.env

// if (cluster.isMaster) {
//     for (var i = 0; i < app_workers; i++) {
//         cluster.fork();
//     }
//     cluster.on('exit', (worker, code, signal) => {
//         console.error({
//             code: code,
//             signal: signal,
//         }, 'worker died un-expectedly... restarting it.');
//         // Fork if a worker dies.
//         cluster.fork();
//     });
// } else {
    
    // init express app
    require('./util/express-app')
    
    // setup express app
    require("./serve")
    require("./upload")
    require("./txt")
    require("./password")
    
    // setup glx
    require('./glx')

    require('./util/greenlock-domain-register')("biarbala.ir")
// }

