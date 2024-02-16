const { Schema, model, Types } = require('mongoose');

const IMAGE_URL = /^https?:\/\/.*/i

const itemSchema = new Schema({
    title: { type: String, required: true, minLength: [4, 'Title must be at least 4 characters.'] },
    category: {
        type: String,
        required: true,
        enum: {
            values: ['vehicles',' real' ,'estate', 'electronics', 'furniture', 'other'],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    },
    price: { type: Number, required: true, min: [1, 'Price cannot be a negative number.'] },

    imgUrl: {
        type: String,
        required: true,
        validate: {
            validator: (value) => IMAGE_URL.test(value),
            message: 'Invalid Url.'
        }
    },

    description:{type:String,required:true,maxLength:[200,'Description must be at most 200 characters.']},

    owner: { type: Types.ObjectId, ref: 'User', required: true },

    bider: { type: Types.ObjectId, ref: 'User' }

});


itemSchema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})


const Item = model('Item', itemSchema)

module.exports = Item;