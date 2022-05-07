const {Router} = require('express')
const Reserve = require('../models/form_data')
const router = Router()

router.get('/', async (req, res) => {
    const reserve = await Reserve.find({})

    res.render('first', { 
        title: 'Cafe',
        isMain: true
    })
})

// router.post('/', async (req, res) => {
//     //save data to db
//     res.render('first', {
//         title: 'Cafe',
//         isMain: true
//     })
// })

router.get('/menu', (req, res) => {
    res.render('menu', {
        title: 'Menu',
        isMenu: true
    })
})

router.get('/reservation', (req, res) => {
    res.render('reservation', {
        title: 'Reservation',
        isReservation: true
    })
})

router.post('/reservation', async (req, res) =>{
    const reserve = new Reserve({
        date: req.body.user_date,
        time: req.body.user_time,
        name: req.body.user_name,
        mail: req.body.user_mail,
        message: req.body.user_message
    })

    // const date = req.body.user_date
    // console.log(date)
    // const time = req.body.user_time
    // console.log(time)
    // const user_name = req.body.user_name
    // console.log(user_name)
    // const mail = req.body.user_mail
    // console.log(mail)

    // await reserve.save()
    res.redirect('/menu')
})

module.exports = router