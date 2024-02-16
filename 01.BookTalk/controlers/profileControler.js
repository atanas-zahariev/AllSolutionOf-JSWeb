const Item = require('../models/Item');
const User = require('../models/User');

const profileControler = require('express').Router();

profileControler.get('/profile',async (req,res) => {
    const currentUser = await User.findById(req.user._id).lean();

    const allBooks = await Item.find({}).lean();
    const userWishes = allBooks.filter(x => x.wishingList.map(x => x.toString()).includes(currentUser._id.toString()));
    
    res.render('profile',{
        currentUser,
        userWishes
    })
})

module.exports = profileControler;