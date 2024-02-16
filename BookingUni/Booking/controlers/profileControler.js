const createProfile = require('../services/profileService');

const profileControler = require('express').Router();

profileControler.get('/profile',async (req,res) => {
    const user = await createProfile(req.user._id);
    
    user.BookHotel = user.BookHotel.join(', ')

    res.render('profile',{
        user
    });
})

module.exports = profileControler