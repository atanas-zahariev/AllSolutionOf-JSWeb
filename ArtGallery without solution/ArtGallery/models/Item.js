const { Schema, model ,Types} = require('mongoose');

const URL_REGEX = /^https?:\/\/.*/i

const itemShema = new Schema({
    title:{type: String,required: true, minLength:[6, 'The Title should be a minimum of 6 characters long.']},

    paintingTech:{type: String,required: true, maxLength:[15, 'The Painting technique should be a maximum of 15 characters long.']},

    imgUrl: {
        type: String,
        required: true,
        validate: {
            validator: (value) => URL_REGEX.test(value),
            message: 'ImageUrl must begining with http or https.'
        }
    },
    
    certificate:{
        type: String,
        required: true,
        enum: {
            values: ["Yes" , "No"],
            message: 'The Certificate of authenticity there must be value "Yes" or "No".'
        }
    },

    owner:{type:Types.ObjectId,ref:'User'},

    collectionProperty: {type:[Types.ObjectId],ref:'User',default:[]},


})

const Item = model('Item', itemShema);

module.exports = Item
