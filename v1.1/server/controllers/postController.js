const { create, select, update, deleteItem } = require('../database/db_functions')

const { formatValues } = require('../database/helpers')

const createPost = create('Posts')
const selectPost = select('Posts')
const modifyPost = update('Posts')
const deletePost = deleteItem('Posts')

module.exports = {
    create: function (req, res) {
        let { user, imgur_link, description, category, points } = req.body
        let newPost = { user, imgur_link, description, category, points }
        createPost(newPost)
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    getByID: function (req, res) {
        let { id } = req.params
        selectPost(['*'], { id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    getByCategory: function (req, res) {
        let { category } = req.params
        // selectPost(['*'], { category })
        //     .then(result => res.status(200).json({ "success": true, result }))
        //     .catch(error => res.status(500).json({ "success": false, error }))

        const db = require('../database/database')
        let query = `SELECT posts.*, votes.payload, votes.id as "vote_id" FROM posts
LEFT JOIN votes ON posts.id = votes.post_id WHERE posts.category = "${category}"
UNION
SELECT posts.*, votes.payload, votes.id as "vote_id" FROM posts
RIGHT JOIN votes ON posts.id = votes.post_id
WHERE posts.category = "${category}";`

        db.query(query, (error, result) => {
            if (error) res.status(500).json({ "success": false, error })
            else res.status(200).json({ "success": true, result })
        })
    },

    getByUserID: function (req, res) {
        let { user } = req.params
        selectPost(['*'], { user })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    deleteByID: function (req, res) {
        let { id } = req.params
        deletePost({ id, conditions })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    modifyByID: function (req, res) {
        let { id, conditions } = req.params
        modifyPost(conditions, { id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    getFeed: function (req, res) {
        const db = require('../database/database')
        let { userArray } = req.body
        let query = `SELECT * FROM posts WHERE user IN (${formatValues(userArray)});`
        console.log('getFeed', query)
        db.query(query, (error, result) => {
            if (error) res.status(500).json({ "success": false, error })
            else res.status(200).json({ "success": true, result })
        })
    }

}