const word = require('random-words')

const { random_word_number = 2 } = process.env

// generate words like 'express-application'
function getRandomName () {
    return word(random_word_number).join('-')
}

module.exports = getRandomName