const serve = require('./util/serve-site')
const recource = require('./util/extract-resource')
const excluder = require('./util/exclude-forbidden-resource')
const find = require('./util/find-site')

const app = require('./util/express-app')

// extract requested resource from request
app.use(recource)

// exclude forbidden resources like PASSWORD
app.use(excluder)

// find the site based on subdomain of biarbala.ir or domain
app.use(find.subdomain)
app.use(find.domain)

app.get('*', serve)