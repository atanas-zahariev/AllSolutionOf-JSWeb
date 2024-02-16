const { createHotel, getHotelById, bookHotel, editHotel, deleteHotel } = require('../services/hotelService');
const { parseError } = require('../util/parser');

const hotelControler = require('express').Router();


hotelControler.get('/create', (req, res) => {
      res.render('create')
})

hotelControler.post('/create', async (req, res) => {
      const { name, city, rooms, imgUrl } = req.body;
      const hotel = {
            name,
            city,
            rooms: Number(rooms),
            imgUrl,
            owner: req.user._id
      }
      try {
            if (Object.values(hotel).some(v => v == '')) {
                  throw new Error('All fields are requiered.')
            }

            await createHotel(hotel)

            res.redirect('/')

      } catch (error) {
            res.render('create', {
                  errors: parseError(error)
            })
      }

})

hotelControler.get('/details/:id', async (req, res) => {

      const hotel = await getHotelById(req.params.id);

      if (req.user._id == hotel.owner) {
            hotel.isOwner = true;
      }

      if (hotel.usersBookedRoom.map(b => b.toString()).includes(req.user._id)) {
            hotel.isBooked = true;
      }

      res.render('details', {
            hotel
      });
});

hotelControler.get('/book/:id', async (req, res) => {
      try {
            await bookHotel(req.params.id, req.user._id);

            res.redirect(`/hotel/details/${req.params.id}`);

      } catch (error) {
            const hotel = await getHotelById(req.params.id);
            hotel.isBooked = true;
            res.render('details', {
                  hotel,
                  errors: parseError(error)
            })
      }
})

hotelControler.get('/edit/:id', async (req, res) => {
      const hotel = await getHotelById(req.params.id);

      if (hotel.isOwner != req.user_id) {
            return res.redirect('/auth/login')
      }

      res.render('edit', {
            hotel
      })
})

hotelControler.post('/edit/:id', async (req, res) => {
      const hotel = await getHotelById(req.params.id);

      if (hotel.isOwner != req.user_id) {
            return res.redirect('/auth/login')
      }
      const { name, city, rooms, imgUrl } = req.body;

      const edited = {
            name,
            city,
            rooms,
            imgUrl
      }
      
      try{
            if (Object.values(edited).some(v => v == '')) {
                  throw new Error('All fields are requiered.')
            }

            await editHotel(req.params.id, edited);
      
            res.redirect(`/hotel/details/${req.params.id}`);
      }catch(error){
            res.render('edit',{
                  hotel,
                  errors: parseError(error)
            })

      }

})

hotelControler.get('/delete/:id', async (req, res) => {
      await deleteHotel(req.params.id);

      res.redirect('/');
})

module.exports = hotelControler;