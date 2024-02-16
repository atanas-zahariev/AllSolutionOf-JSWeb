const { Schema, model, Types } = require('mongoose');

const IMAGE_URL = /^https?:\/\/.*/i
const itemSchema = new Schema({
    startPoint: { type: String, required: true, minLength:[4, 'Start point must be at least 4 charcters.']},

    endPoint: { type: String, required: true, minLength:[4, 'End point must be at least 4 charcters.'] },

    date: { type: String, required: true },

    time: { type: String, required: true },

    imgUrl: {
        type: String, required: true, validate: {
            validator: (value) => IMAGE_URL.test(value),
            message: 'Invalid Url.'
        }
    },
    brand: { type: String, required: true, minLength:[4, 'Brand must be at least 4 charcters.']},

    seats: { type: Number, required: true, min:[0, 'Seats must be a positive number.'],max:[4, 'Seats must be a most 4.'] },

    price: { type: Number, required: true, min:[1, 'Price must be a positive number.'],max:[50, 'Price must be a most 50.']},

    description: { type: String, required: true, minLength:[10, 'Description must be at least 4 charcters.'] },

    owner: { type: Types.ObjectId, ref: 'User' },

    buddies: { type: [Types.ObjectId], ref: 'User', default: [] }

})


itemSchema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})


const Item = model('Item', itemSchema);

module.exports = Item;