const {Schema, model} = require('mongoose')

const schema = Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    message: {
        type: String
    }
})

module.exports = model('Reserve', schema)