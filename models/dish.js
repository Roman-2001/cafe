const {Schema, model} = require('mongoose')

const schema = Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
})

module.exports = model('Dish', schema)