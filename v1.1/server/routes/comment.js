const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')
const withAuth = require('../auth')

router.use(withAuth)

router.route('/')
    .post(commentController.create)

router.route('/id/:id')
    .get(commentController.getByID)
    .delete(commentController.deleteByID)
    .patch(commentController.modifyByID)

router.route('/user/:id')
    .get(commentController.getByUserID)

module.exports = router