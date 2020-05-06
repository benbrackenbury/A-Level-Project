const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

let allowedRoutes = [
    { method: 'POST', url: '/api/user/auth' },
    { method: 'POST', url: '/api/user' }
]

const withAuth = (req, res, next) => {
    let { method, originalUrl } = req
    let thisRoute = { method, url: originalUrl }
    let isAllowed = false
    allowedRoutes.forEach(route => {
        if (JSON.stringify(route) == JSON.stringify(thisRoute)) {
            isAllowed = true
        }
    })
    if (isAllowed) next()
    else {
        const token =
            req.body.token ||
            req.query.token ||
            req.headers['authorization']
        if (!token) {
            res.status(401).json({ "success": false, "error": "No token provided" })
            console.log('no token', req.headers['authorization'])
        } else {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) res.status(401).json({ "success": false, "error": "Invalid token" })
                else next()
            })
        }
    }
}
module.exports = withAuth