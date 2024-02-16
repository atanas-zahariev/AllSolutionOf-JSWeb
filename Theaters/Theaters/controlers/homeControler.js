const { getAllItems } = require('../services/itemService');

const homeControler = require('express').Router();

homeControler.get('/', async (req,res) => {
    const items = await getAllItems()

    if(req.user){
        res.render('user-home',{
            items
        })

    }else{
        res.render('guest-home',{
            items
        })
    }

})

module.exports = homeControler;



// Todo replace with real controler by assigment 