const uploader = require('./util/zip-upload')
const limiter = require('./util/upload-limiter')
const save = require('./util/save-site')
const init = require('./util/init-site-upload')

const app = require('./util/express-app')

app.post("/",
// default limit 15 mb
limiter(15),

// set the siteName and uploadPath
init,

// upload the zip to uploadPath
uploader,

// save the site for siteName at uploadPath
save,

// 200 ok site: {...}
req => req.res.json(req.site))
