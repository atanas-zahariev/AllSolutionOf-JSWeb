const { Schema, model, Types } = require('mongoose');

const URL_REGEX = /^https?:\/\/.*/i

const itemShema = new Schema({
    title: { type: String, required: true, minLength: [6, 'Title must be at least 6 characters long'] },

    keyword: { type: String, required: true, minLength: [6, 'Keyword must be at least 6 characters long'] },

    location: { type: String, required: true, maxLength: [15, 'The Location should be a maximum of 15 characters long.'] },

    date: {
        type: String, required: true,
        minLength: [10, 'Date must be exactly 10 characters long'],
        maxLength: [10, 'Date must be exactly 10 characters long']
    },

    imgUrl: {
        type: String,
        required: true,
        validate: {
            validator: (value) => URL_REGEX.test(value),
            message: 'ImageUrl must begining with http or https.'
        }
    },
    description: { type: String, required: true, minLength: [8, 'The Description should be a minimum of 8 characters long.'] },

    owner: { type: Types.ObjectId, ref: 'User' },

    collectionProperty: { type: [Types.ObjectId], ref: 'User', default: [] },

    raiting: { type: Number, default: 0 }

})

const Item = model('Item', itemShema);

module.exports = Item
