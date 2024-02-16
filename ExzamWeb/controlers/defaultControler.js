const defaultControler = require('express').Router()

defaultControler.get('*', (req,res) => {
    res.render('404')
})

module.exports = defaultControler;