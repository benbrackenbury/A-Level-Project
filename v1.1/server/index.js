const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT
const { db } = require('./database/database')
const router = require('./routes/index')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', router)

app.listen(port, () => console.log(`Server started on port ${port}`))