const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const withAuth = require('../auth')

router.use(withAuth)

router.route('/')
    .post(postController.create)

router.route('/id/:id')
    .get(postController.getByID)
    .delete(postController.deleteByID)
    .patch(postController.modifyByID)

router.route('/feed')
    .post(postController.getFeed)

router.route('/user/:user')
    .get(postController.getByUserID)

router.route('/category/:category')
    .get(postController.getByCategory)

module.exports = router