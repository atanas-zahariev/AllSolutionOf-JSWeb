const defaultControler = require('express').Router();


defaultControler.get('*', (req, res) => [
    res.render('/')
])


module.exports = defaultControler;