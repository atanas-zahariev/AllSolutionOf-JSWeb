const User = require("../models/User");
const Hotel = require("../models/Hotel");



async function createProfile(userId) {
    const user = await User.findById(userId).lean()
    const hotels = await Hotel.find({});

    user.BookHotel = []

    for (const hotel of hotels) {
        if (hotel.usersBookedRoom.map(b => b.toString()).includes(userId)) {
            user.BookHotel.push(hotel.name)
        }
    }

    return user;
};


module.exports = createProfile;