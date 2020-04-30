const fs = require('fs')
const unzipper = require('unzip-stream')
const rmrf = require('./fs/rmrf')

// must set req.uploadPath
function zipUpload(req, res, next) {
    // must set req.uploadPath
    const tmpPath = `${process.cwd()}/tmp`
    let { uploadPath: path = tmpPath } = req
    let had_file = false;
    let not_zip = false;
    let limit_reach = false;
    let fstream_err = null;
    let extract_err = null;
    
    let extract;

    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        had_file = true;
        if(["zip",
        "application/zip",
        "application/x-zip",
        "application/x-zip-compressed"].includes(mimetype) === false) {
            return not_zip = true;
        }

        fs.mkdir(path, err => {
            if(err) {
                return fstream_err = err;
            }
            extract = file.pipe(unzipper.Extract({ path }))
            extract.on('error', err => extract_err = err)
        })

        // If the file is larger than the set limit
        // delete partially uploaded file 
        file.on('limit', () => {
            fs.unlink(path, () => { 
                limit_reach = true;
            });
        });
    });

    // Despite being asynchronous limit_reach 
    // will be seen here as true if it hits max size 
    // as set in file.on.limit because once it hits
    // max size the stream will stop and on.finish
    // will be triggered.
    req.busboy.on('finish', async () => {
        console.log("busboy finished")

        return extract.on('close', async () => {
            console.log("extract end")
            const undo = async () => await rmrf(path)
            try {
                if(!had_file) {
                    await undo()
                    return res.status(400).json("there is no zip file")
                }
        
                if(not_zip) {
                    await undo()
                    return res.status(409).json("it is not a zip file")
                }
        
                if(limit_reach) {
                    await undo()
                    return res.status(455).json("file size or number limit reached")
                }
        
                if(fstream_err) {
                    await undo()
                    throw fstream_err
                }
        
                if(extract_err) {
                    await undo()
                    return res.status(400).json("zip file is broken")
                }

                return next()
            } catch (err) {
                console.error(err)
                return res.status(500).json("we couldn't save the site")
            }
        })
    });

    req.pipe(req.busboy)
}

module.exports = zipUpload