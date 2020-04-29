const Greenlock = require('greenlock')

const cwd = process.cwd()
const {
    acme_server = 'staging' // 'production'
} = process.env;

const http01 = require('acme-http-01-webroot').create({
    webroot: `${cwd}/acme-challenge`
})

const staging = acme_server === "staging"
const greenlock = Greenlock.create({
    staging,

    manager: "@greenlock/manager",
    challenges: {
        'http-01': {
            module: 'acme-http-01-webroot',
            webroot: `${cwd}/acme-challenge`
        }
    },
    maintainerEmail: "force1267@gmail.com",
    agreeTos: true,
    packageAgent: "biarbala.ir/0.3.0",
    packageRoot: cwd,
    configDir: `${cwd}/greenlock.d`,
    notify: (event, details) => {
        if ('error' === event) {
            // `details` is an error object in this case
            console.error(details);
        }
    }
})
greenlock.manager.defaults({
    agreeToTerms: true,
    subscriberEmail: "force1267@gmail.com",
    store: {
        module: "greenlock-store-fs",
        basePath: `${cwd}/greenlock.d`
    },
    // challenges: {
    //     "http-01": {
    //         module: "acme-http-01-webroot",
    //         webroot: `${cwd}/acme-challenge`
    //     }
    // }
})
.then(fullConfig => {})


module.exports = greenlock