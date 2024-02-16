const { Schema, model, Types } = require('mongoose');

const IMAGE_URL = /^https?:\/\/.*/i
                
const itemSchema = new Schema({
    title: { type: String, minlength: [4,'Title must be at least 4 characters.'] },
    description: {
        type: String,
        minlength: [20, 'Description must be at least 20 chractares.'],
        maxlength: [50, 'Description must ba at most 50 charctares.']
    },
    imgUrl:{type:String,required:true,validate:{
        validator:(value) => IMAGE_URL.test(value),
        message: 'Invalid Url.'
    }},
    duration:{type:String, required:true},
    createdAt:{type:String, required:true,default: () => (new Date).toISOString().slice(0,10)},
    enrolledUsers:{type:[Types.ObjectId], ref:'User', default:[]},
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