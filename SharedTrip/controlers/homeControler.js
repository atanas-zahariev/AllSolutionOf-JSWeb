const homeControler = require('express').Router();


homeControler.get('/', (req,res) => {
    res.render('home', {
        title:'Home Page'
    })
});


module.exports = homeControler;