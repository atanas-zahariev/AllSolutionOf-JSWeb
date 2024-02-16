const { Schema, model, Types } = require('mongoose');

const IMAGE_URL = /^https?:\/\/.*/i

const itemSchema = new Schema({  
    name:{type:String,required:true, minLength:[6, 'Name must be at least 6 characters.']},

    type:{type:String,
        required:true,
        enum:{
            values: ['Apartment', 'Villa', 'House'],
            message: 'Put valid property name.'
          }
    },

    year:{type:Number,required:true,min:[1850, 'Year must be minimum 1850'],max:[2021, 'Year must be maximum  2021']},

    city:{type:String,required:true, minLength:[4, 'City must be at least 4 characters.']},

    imgUrl:{type:String,required:true,validate:{
        validator:(value) => IMAGE_URL.test(value),
        message: 'Invalid Url.'
    }},

    description:{type:String,required:true, maxLength:[60, 'Description must be at most 60 characters.']},
    
    availablePieces:{
        type:Number,
        required:true,
        min:[0, 'Pices must be positive number hayer or equal to zero'],max:[10, 'Pieces must be at most 10.']},
    

    rentedAHome:{type:[Types.ObjectId], ref:'User', default:[]},

    owner: {type:Types.ObjectId, ref:'User'}
});


itemSchema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})


const Item = model('Item', itemSchema);

module.exports = Item;