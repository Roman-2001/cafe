const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const path = require('path')
const routes = require('./routes/cafe')

const PORT = process.env.PORT || 3000
const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(routes)

async function start() {
    try {
        await mongoose.connect('mongodb+srv://Roman:ghjabkm@cluster0.xew6z.mongodb.net/cafe', {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
    console.log('Server has been started...')
})
    } catch (e) {
        console.log('OOPS...')
        console.log(e)
    }
}

start()