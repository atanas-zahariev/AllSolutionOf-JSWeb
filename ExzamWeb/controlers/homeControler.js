const { getAllItems } = require('../services/itemService');

const homeControler = require('express').Router();

homeControler.get('/', async (req,res) => {
    let items = await getAllItems()
    items = items.splice(-3);
    
    res.render('home',{
       items
    } )
})

module.exports = homeControler;



// Todo replace with real controler by assigment 