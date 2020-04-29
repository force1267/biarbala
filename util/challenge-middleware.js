const gl = require('./greenlock')

if (!gl.challenges || !gl.challenges.get) {
    throw new Error("middleware requires challenge plugin with get method");
}


function middleware(_app) {
    if (_app && 'function' !== typeof _app) {
        throw new Error("use greenlock.middleware() or greenlock.middleware(function (req, res) {})");
    }
    var prefix = '/.well-known/acme-challenge/';

    return function (req, res, next) {
        if (0 !== req.url.indexOf(prefix)) {
            if ('function' === typeof _app) {
                _app(req, res, next);
            }
            else if ('function' === typeof next) {
                next();
            }
            else {
                res.statusCode = 500;
                res.end("[500] Developer Error: app.use('/', greenlock.middleware()) or greenlock.middleware(app)");
            }
            return;
        }

        var token = req.url.slice(prefix.length);
        var servername = req.hostname || (req.headers.host || '').toLowerCase().replace(/:.*/, '');

        token && gl.challenges.get({ servername, token, type: 'http-01' }).then(result => {
            let { keyAuthorization: secret } = result

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(secret);
        }).catch(err => {
            console.log(err)
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end('{ "error": { "message": "Error: These aren\'t the tokens you\'re looking for. Move along." } }');
        })
    };
};


module.exports = middleware