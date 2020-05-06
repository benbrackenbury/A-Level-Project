const express = require('express')
const router = express.Router()
const userRoutes = require('./user')
const postRoutes = require('./post')
const commentRoutes = require('./comment')
const voteRoutes = require('./vote')

router.use('/user', userRoutes)
router.use('/post', postRoutes)
router.use('/comment', commentRoutes)
router.use('/vote', voteRoutes)

router.route('/')
    .get((req, res) => {
        res.status(200).send(`<h1 style="font-family: Arial, Helvetica, sans-serif">API Endpoint</h1>`)
    })

module.exports = router