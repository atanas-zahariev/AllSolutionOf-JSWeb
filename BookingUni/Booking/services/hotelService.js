const Hotel = require("../models/Hotel");

async function getAllHotels() {
    const hotels = await Hotel.find({}).lean();
    return hotels;
}

async function createHotel(hotel) {
    const newHotel = await Hotel.create(hotel);
    return newHotel;
}

async function getHotelById(id) {
    const hotel = await Hotel.findById(id).lean()
    return hotel;
}

async function bookHotel(hotelId, userId) {
    const hotel = await Hotel.findById(hotelId)

    if (hotel.usersBookedRoom.includes(userId)) {
        throw new Error('Cannot book room twise')
    }

    hotel.usersBookedRoom.push(userId);

    await hotel.save();
}

async function editHotel(hotelId, edited) {
    const existing = await Hotel.findById(hotelId)

    const { name, city, rooms, imgUrl } = edited

    existing.name = name;
    existing.city = city;
    existing.rooms = rooms;
    existing.imgUrl = imgUrl;

    await existing.save();

    return existing
}

async function deleteHotel(hotelId) {
    await Hotel.findByIdAndDelete(hotelId);
}


module.exports = {
    getAllHotels,
    createHotel,
    getHotelById,
    bookHotel,
    editHotel,
    deleteHotel
};