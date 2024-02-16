const { getAllItem } = require('../services/itemService');

const homeControler = require('express').Router();


homeControler.get('/', async (req,res) => {
    const offers = await getAllItem();
    res.render('home',{
        offers
    })
});


module.exports = homeControler;