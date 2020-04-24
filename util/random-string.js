const randomString = require('crypto-random-string')

module.exports = len => randomString({length: len});