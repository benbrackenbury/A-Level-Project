const sql = require('mysql')
const db_object = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: process.env.DB
}


//set up database connection
let db = sql.createConnection(db_object)
db.connect(err => {
    if (err) console.error('⚠ NOT CONNECTED TO DATABASE ⚠', `\n${err}`)
    else console.log("Connected!")
})

module.exports = db