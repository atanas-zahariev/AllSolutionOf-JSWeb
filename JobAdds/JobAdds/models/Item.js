const { Schema, model ,Types} = require('mongoose');

const URL_REGEX = /^https?:\/\/.*/i

const itemShema = new Schema({
    headline:{type:String,required:true,minLength:[4, 'The Headline should be a minimum of 4 characters long']},

    location:{type:String,required:true,minLength:[8, 'The Location should be a minimum of 8 characters long']},

    companyName:{type:String,required:true,minLength:[3, 'The Company name should be at least 3 characters']},

    description:{type:String,required:true,maxLength:[40, 'The Company description should be a maximum of 40 characters long']},

    owner:{type:Types.ObjectId,ref:'User'},

    collectionProperty: {type:[Types.ObjectId],ref:'User',default:[]}

})

const Item = model('Item', itemShema);

module.exports = Item
