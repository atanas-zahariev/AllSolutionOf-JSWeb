const { Schema, model ,Types} = require('mongoose');

const URL_REGEX = /^https?:\/\/.*/i

const itemShema = new Schema({
    image: {
        type: String,
        required: true,
        validate: {
            validator: (value) => URL_REGEX.test(value),
            message: 'ImageUrl must begining with http or https.'
        }
    },
    enumProperty:{
        type: String,
        required: true,
        enum: {
            values: ['PC', 'Nintendo', 'PS4', 'PS5','XBOX',/*or sommenthing else*/ ],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    },

    createdAt:{type:String, required:true,default: () => (new Date).toISOString().slice(0,10)},
                       ///mongoose execute function and return 2023-06-18;

    collectionProperty: {type:[Types.ObjectId],ref:'User',default:[]},

    owner:{type:Types.ObjectId,ref:'User'}
})

const Item = model('Item', itemShema);

module.exports = Item
