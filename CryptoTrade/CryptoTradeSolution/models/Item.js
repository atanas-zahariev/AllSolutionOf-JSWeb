const { Schema, model, Types } = require('mongoose');

const URL_REGEX = /^https?:\/\/.*/i

const itemShema = new Schema({
    name: { type: String, required: true, minLength: [2, 'Name must be at least 2 characters.'] },

    imgUrl: {
        type: String,
        required: true,
        validate: {
            validator: (value) => URL_REGEX.test(value),
            message: 'ImageUrl must begining with http or https.'
        }
    },
    price: { type: Number, required: true, min: [1, 'Price must be a positive number.'] },

    description: { type: String, required: true, minLength: [10, 'Description shuld be a minimum 10 characters.'] },

    paymentMethod: {
    type: String,
    required: true,
    enum: {
        values: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'],
        message: ' Payment Method must be one of the options`'
    }
},
    collectionProperty: { type: [Types.ObjectId], ref: 'User', default: [] },

    owner: { type: Types.ObjectId, ref: 'User' }
})

const Item = model('Item', itemShema);

module.exports = Item
