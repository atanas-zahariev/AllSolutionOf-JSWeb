const { getAllHotels } = require('../services/hotelService');

const homeControler = require('express').Router();

homeControler.get('/', async (req,res) => {
    const hotels = await getAllHotels()
    res.render('home',{
       hotels
    } )
})

module.exports = homeControler;



// Todo replace with real controler by assigment 