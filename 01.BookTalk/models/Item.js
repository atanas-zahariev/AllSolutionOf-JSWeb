const { Schema, model, Types } = require('mongoose');

const IMAGE_URL = /^https?:\/\/.*/i
                 ///^https?:\/\/.*/i
const itemSchema = new Schema({
    title: { type: String, required: true, minlength: [2,'Title must be at least 2 characters.'] },

    author:{type:String,required:true,minlength: [5,'Author must be at least 5 characters.']},

    genre:{type:String,required:true,minlength:[3,'Genre must be at least 3 characters.']},

    stars:{type:Number,required:true,min:[1, 'Stars must be at least 1.'],max:[5, 'Stars must be at most 5.']},
   
    image:{type:String,required:true,validate:{
        validator:(value) => IMAGE_URL.test(value),
        message: 'Invalid Url.'
    }},

    review:{type:String,required:true,minlength:[10,'Review must be at least 10 characters.']},

    wishingList:{type:[Types.ObjectId], ref:'User', default:[]},

    owner: {type:Types.ObjectId, ref:'User'}
});



const Item = model('Item', itemSchema);

module.exports = Item;