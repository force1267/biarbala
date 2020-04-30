const express = require('express')
const logger = require('morgan')
const body = require('body-parser')
const helmet = require('helmet')

const {
    logger_level = "dev",
} = process.env


const app = express()

app.use(helmet())
app.use(logger(logger_level))
app.use(body.json())
app.use(body.urlencoded({ extended: false }))

module.exports = app