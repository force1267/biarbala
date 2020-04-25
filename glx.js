const glx = require('greenlock-express')
const cwd = process.cwd()
const app = require('./util/express-app')

const {
    acme_server = 'staging' // 'production'
} = process.env;

const lex = glx.init({
    version: 'draft-12',
    server: `https://acme${acme_server === "staging" ? "-staging" : ''}-v02.api.letsencrypt.org/directory`,
    cluster: false,
    // approveDomains,

    maintainerEmail: "force1267@gmail.com",
    packageAgent: "biarbala.ir/0.2.0",
    agreeTos: true,
    packageRoot: cwd,
    configDir: `${cwd}/greenlock.d`
})

lex.serve(app);

// function approveDomains(opts, certs, cb) {
//     // This is where you check your database and associated
//     // email addresses with domains and agreements and such


//     // The domains being approved for the first time are listed in opts.domains
//     // Certs being renewed are listed in certs.altnames
//     console.log("[][][][][][] check [][][][][][] ------- []:", opts, certs)
//     if (certs) {
//         opts.domains = certs.altnames;
//     } else {
//         opts.email = 'force1267@gmail.com';
//         opts.agreeTos = true;
//     }

//     // NOTE: you can also change other options such as `challengeType` and `challenge`
//     // opts.challengeType = 'http-01';
//     // opts.challenge = require('le-challenge-fs').create({});

//     cb(null, { options: opts, certs });
// }