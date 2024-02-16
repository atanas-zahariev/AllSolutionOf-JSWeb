const homeControler = require('express').Router();

homeControler.get('/', (req,res) => {
    res.render('home')
})

module.exports = homeControler;



// Todo replace with real controler by assigment 