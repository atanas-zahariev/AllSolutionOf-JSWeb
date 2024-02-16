const { Schema, model, Types } = require('mongoose');

const URL_REGEX = /^https?:\/\/.*/i
///^(https?:\/)?\/.*/i
const hotelSchema = new Schema({
    name: {
        type: String,
        minLength: [4, 'Hotel Name must be at least 4 chractares long.']
    },
    city: {
        type: String,
        minLength: [3, 'City Name must be at least 3 chractares long.']
    },
    imgUrl: {
        type: String,
        validate:{
            validator:(value) => URL_REGEX.test(value),
            message: 'Url must begining with http or https.'
        }        
    },
    rooms:{
        type: Number,
        min:[1, 'Rooms must be at least 1.'],
        max: [100, 'Rooms must be at most 100.']
    },
    usersBookedRoom: {
        type:[Types.ObjectId],
        ref:'User',
        default:[]
    },
    owner:{
        type:Types.ObjectId,
        ref:'User'
    }
});

const Hotel = model('Hotel', hotelSchema)

module.exports = Hotel;
