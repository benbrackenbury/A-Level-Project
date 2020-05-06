let enquote = x => typeof (x) == "string" ? `"${x}"` : x

module.exports = {
    formatKeys: data => Object.keys(data).join(','),
    formatValues: data => {
        let valuesArray = []
        Object.values(data).map(value => {
            valuesArray.push(enquote(value))
        })
        return valuesArray.join(',')
    },
    iterateArray: array => `(${array.map(el => el)})`,
    enquote
}