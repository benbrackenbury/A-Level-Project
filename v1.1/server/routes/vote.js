const express = require('express')
const router = express.Router()
const voteController = require('../controllers/voteController') //need to make this...
const withAuth = require('../auth')

router.use(withAuth)

router.route('/')
    .post(voteController.create)
    .delete(voteController.deleteByUserAndPost)

router.route('/:id')
    .get(voteController.getVotesForPost)
    .delete(voteController.remove)

router.route('/:postID/:userID')
    .get(voteController.getAllVoteDetails)

module.exports = router