const { add } = require('../util/domains')

let domain = process.argv[2]
console.log("adding domain", domain)
add(domain).then(console.log).catch(console.error)