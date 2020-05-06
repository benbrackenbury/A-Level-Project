const { create, select, update, deleteItem } = require('../database/db_functions')
const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET

const createVote = create('votes')
const selectVote = select('votes')
const modifyVote = update('votes')
const deleteVote = deleteItem('votes')

module.exports = {
    create: function (req, res) {
        let { user_id, post_id, payload } = req.body
        let newVote = { user_id, post_id, payload }
        createVote(newVote)
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    remove: function (req, res) {
        let { id } = req.params
        deleteVote({ id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    deleteByUserAndPost: function (req, res) {
        let { post_id, user_id } = req.body
        deleteVote([{ user_id }, { post_id }], 'AND')
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    getVotesForPost: function (req, res) {
        let { id } = req.params
        selectVote(['payload'], { post_id: id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    getAllVoteDetails: function (req, res) {
        let user_id = req.params.userID
        let post_id = req.params.postID
        console.log(post_id, user_id)

        selectVote(['*'], { post_id, user_id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    }

}