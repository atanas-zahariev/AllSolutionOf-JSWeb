const homeControler = require('express').Router();

homeControler.get('/', (req,res) => {
    res.render('home',{
        title: 'Home Page',
        user: req.user
    } )
})

module.exports = homeControler;



// Todo replace with real controler by assigment 