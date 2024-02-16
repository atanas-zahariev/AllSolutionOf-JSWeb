const { getAllItem, getAllItemByCount } = require('../services/itemService');

const homeControler = require('express').Router();


homeControler.get('/', async (req,res) => {
    const search = req.query.search;
    if(req.user){
        const courses = await getAllItem(search);
        res.render('user-home',{
            courses,
            search
        })
    }else{
        const courses = await getAllItemByCount();
        res.render('guest-home',{
            courses,
        })
    }
});


module.exports = homeControler;