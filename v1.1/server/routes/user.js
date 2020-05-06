const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const withAuth = require('../auth')

router.use(withAuth)

router.route('/')
    .post(userController.create)

router.route('/id/:id')
    .get(userController.getUserByID)
    .delete(userController.deleteUserByID)
    .patch(userController.modifyUserByID)

router.route('/username/:username')
    .get(userController.getUserByUsername)
    .delete(userController.deleteUserByUsername)
    .patch(userController.modifyUserByUsername)

router.route('/follow')
    .post(userController.follow)

router.route('/follow/:follower')
    .get(userController.getUsersIFollow)

router.route('/follow/:following/:follower')
    .delete(userController.unFollow)
    .get(userController.getFollows)

router.route('/auth')
    .post(userController.authenticate)

module.exports = router