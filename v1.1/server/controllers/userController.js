const { create, select, update, deleteItem } = require('../database/db_functions')
const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET

const createUser = create('Users')
const createFollow = create('Follows')
const selectUser = select('Users')
const modifyUser = update('Users')
const deleteUser = deleteItem('Users')

module.exports = {
    create: function (req, res) {
        let { username, name, email, password } = req.body
        let newUser = { username, name, email, password }
        createUser(newUser)
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    authenticate: function (req, res) {
        let { username, password } = req.body
        selectUser('*', { username, password })
            .catch(error => res.status(500).json({ "success": false, error }))
            .then(result => {
                if (result.length < 1) {
                    //invalid login details => return error
                    res.status(401).json({ "success": false, error: "invalid username or password" })
                }
                else {
                    //valid login details => generate jsonwebtoken
                    result = JSON.parse(JSON.stringify(result[0])) // don't delete this it works
                    let token = jwt.sign(result, jwt_secret)
                    res.status(200).json({ "success": true, result, token })
                }
            })
    },

    getUserByID: function (req, res) {
        let { id } = req.params.id
        selectUser(['*'], { id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    deleteUserByID: function (req, res) {
        let { id } = req.params
        deleteUser({ id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    modifyUserByID: function (req, res) {
        let { id, conditions } = req.params
        modifyUser(conditions, { id })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    getUserByUsername: function (req, res) {
        let { username } = req.params
        selectUser(['*'], { username: req.params.username })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    deleteUserByUsername: function (req, res) {
        let { username } = req.params
        deleteUser({ username })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    modifyUserByUsername: function (req, res) {
        let { username, conditions } = req.params
        modifyUser(conditions, { username })
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    follow: function (req, res) {
        let { follower, following } = req.body
        let newFollow = { follower, following }
        createFollow(newFollow)
            .then(result => res.status(200).json({ "success": true, result }))
            .catch(error => res.status(500).json({ "success": false, error }))
    },

    unFollow: function (req, res) {
        let { follower, following } = req.params
        const db = require('../database/database')
        let query = `DELETE FROM Follows WHERE follower="${follower}" AND following="${following}";`
        db.query(query, (error, result) => {
            if (error) res.status(500).json({ "success": false, error })
            else res.status(200).json({ "success": true, result })
        })
    },

    getFollows: function (req, res) {
        let { follower, following } = req.params
        const db = require('../database/database')
        let query = `SELECT * FROM Follows WHERE follower="${follower}" AND following="${following}";`
        db.query(query, (error, result) => {
            if (error) res.status(500).json({ "success": false, error })
            else res.status(200).json({ "success": true, result })
        })
    },

    getUsersIFollow: function (req, res) {
        let { follower } = req.params
        const db = require('../database/database')
        let query = `SELECT * FROM Follows WHERE follower="${follower}";`
        console.log('getUsersIFollow', query)
        db.query(query, (error, result) => {
            if (error) res.status(500).json({ "success": false, error })
            else res.status(200).json({ "success": true, result })
        })
    }
}