const db = require('./database')
const { formatKeys, formatValues, iterateArray, enquote } = require('./helpers')

const create = table => data => {
    return new Promise((resolve, reject) => {
        let queryString = `INSERT INTO ${table} (${formatKeys(data)}) VALUES (${formatValues(data)});`
        console.log(queryString)
        db.query(queryString, (error, result) => {
            error ? reject(error) : resolve(result)
        })
    })
}

const select = table => (fields, conditions = null) => {
    return new Promise((resolve, reject) => {
        let queryString = ''
        if (fields != '*') {
            queryString = `SELECT ${iterateArray(fields).slice(1, -1)} FROM ${table}`
        } else {
            queryString = `SELECT * FROM ${table}`
        }
        if (conditions == null) {
            queryString += ';'
        }
        else {
            let conditionsArray = []
            Object.keys(conditions).map(field => {
                let value = conditions[field]
                let appendix = `${field}=${enquote(value)}`
                conditionsArray.push(appendix)
            })
            let conditionsString = conditionsArray.join(' AND ')
            queryString += ` WHERE ${conditionsString};`
            db.query(queryString, (error, result) => {
                if (error) reject(error)
                else {
                    resolve(result)
                }
            })
        }
    })
}

const update = table => (updates, condition) => {
    return new Promise((resolve, reject) => {
        let updatesArray = []
        for (let change in updates) {
            let obj = {}
            obj[change] = enquote(updates[change])
            updatesArray.push(obj)
        }
        let queryString = `UPDATE ${table} SET ${updatesArray.map(u => `${Object.keys(u)}=${enquote(Object.values(u))}`)} WHERE ${Object.keys(condition)}=${enquote(Object.values(condition))};`
        console.log('Query string:', queryString)
        db.query(queryString, (error, result) => {
            error ? reject(error) : resolve(result)
        })
    })
}

let deleteItem = table => (conditions, logic) => {
    return new Promise((resolve, reject) => {
        let queryString = `DELETE FROM ${table} WHERE `
        console.log(queryString)
        conditions.forEach(condition => {
            queryString += `${Object.keys(condition)}=${enquote(Object.values(condition))}`
            if (conditions.indexOf(condition) != conditions.length - 1) {
                queryString += ` ${logic} `
            } else {
                queryString += `;`
            }
        })
        console.log('Query string:', queryString)
        db.query(queryString, (error, result) => {
            error ? reject(error) : resolve(result)
        });
    })
}


module.exports = { create, select, update, deleteItem }