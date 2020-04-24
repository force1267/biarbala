const fs = require('fs')

const cwd = process.cwd()
const data = `${cwd}/data`

async function load(register) {
    await new Promise((resolve, reject) => {
        let error = false
        fs.readdir(data, (err, files) => {
            if(err) {
                return error = err
            }
            files.forEach(file => {
                fs.stat(`${data}/${file}`, (err, stats) => {
                    if(err) {
                        return error = err
                    }
                    if(stats.isDirectory()) {
                        console.log("loaded ", `${file}.biarbala.ir`)
                        return register(`${file}.biarbala.ir`)
                    } else if(stats.isFile()) {
                        if(file.endsWith(".domain.json")) {
                            let domain = file.slice(0, file.length - 12)
                            console.log("loaded ", domain)
                            return register(domain)
                        }
                    }
                })
            })
        })
        if(error) {
            return reject(error)
        } else {
            return resolve()
        }
    })
}

module.exports = load