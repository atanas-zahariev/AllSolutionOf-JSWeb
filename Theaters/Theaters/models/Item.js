const { Schema, model, Types } = require('mongoose');

const URL_REGEX = /^https?:\/\/.*/i

const itemShema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, maxLength: [50, 'Description must be at most 50 characters.'] },
    imgUrl: {
        type: String,
        required: true,
    },
    check: { type: Boolean, default: false },

    date: { type: String, default: () => new Date().toISOString().slice(0,10)},

    collectionProperty: { type: [Types.ObjectId], ref: 'User', default: [] },

    owner: { type: Types.ObjectId, ref: 'User' }
})

const Item = model('Item', itemShema);

module.exports = Item
