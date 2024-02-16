const { Schema, model ,Types} = require('mongoose');

const URL_REGEX = /^https?:\/\/.*/i

const itemShema = new Schema({
    name:{type: String,required: true,minLength:[2,'The name is required and should be at least 2 characters.']},

    years:{
        type: Number,
        required: true,
        min:[1,'The years are required and should be a number between 1 and 100'],
        max:[100,'The years are required and should be a number between 1 and 100'],

    },

    kind:{type: String,required: true,minLength:[3,'The kind is required and should be at least 3 characters.']},

    imgUrl: {
        type: String,
        required: true,
        validate: {
            validator: (value) => URL_REGEX.test(value),
            message: 'ImageUrl must begining with http or https.'
        }
    },

    need:{
        type: String,
        required: true,
        minLength:[3,'The need is required and should be at least 3 and no longer than 20 characters'],
        maxLength:[20,'The need is required and should be at least 3 and no longer than 20 characters'],
    },

    location:{
        type: String,
        required: true,
        minLength:[5,'The location is required and should be at least 5 and no longer than 15 characters.'],
        maxLength:[15,'The need is required and should be at least 3 and no longer than 20 characters'],
    },

    description:{
        type: String,
        required: true,
        minLength:[5,'The description is required and should be at least 5 and no longer than 50 characters.'],
        maxLength:[50,'The description is required and should be at least 5 and no longer than 50 characters.'],
    },

    collectionProperty: {type:[Types.ObjectId],ref:'User',default:[]},

    owner:{type:Types.ObjectId,ref:'User'}
})

const Item = model('Item', itemShema);

module.exports = Item
