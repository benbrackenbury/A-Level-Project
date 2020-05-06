const { create, select, update, deleteItem } = require('../database/db_functions')

const createComment = create('Comments')
const selectComment = select('Comments')
const modifyComment = update('Comments')
const deleteComment = deleteItem('Comments')

module.exports = {
    create: function (req, res) {
        let { userID, postID, bodyText } = req.body
        let newComment = { user_id: userID, post_id: postID, body: bodyText }
        createComment(newComment)
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    getByID: function (req, res) {
        let { id } = req.params
        selectComment(['*'], { id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    getByUserID: function (req, res) {
        let { id } = req.params
        selectComment(['*'], { user_id: id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    deleteByID: function (req, res) {
        let { id } = req.params
        deleteComment({ id, conditions })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    modifyByID: function (req, res) {
        let { id, conditions } = req.params
        modifyComment(conditions, { id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },
}