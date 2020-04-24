function promised(fn, nothrow = false) {
    return async (...args) => {
        return await new Promise((resolve, reject) => {
            fn(...args, (err, ...data) => {
                if(err) {
                    if(nothrow) {
                        resolve()
                    } else {
                        reject(err)
                    }
                } else {
                    resolve(...data)
                }
            })
        })
    }
}

module.exports = promised