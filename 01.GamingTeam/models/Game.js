const { Schema, model, Types } = require('mongoose');

const URL_REGEX = /^https?:\/\/.*/i

const gameSchema = new Schema({
    name: { type: String, required: true, minLength: [4, 'Name must be at least 4 characters'] },
    image: { 
        type: String,
         required: true,
         validate:{
            validator:(value) => URL_REGEX.test(value),
            message: 'ImageUrl must begining with http or https.'
        } 
        },
    price: { type: Number, required: true ,min: [0, 'Price must be a positive number']},
    description: { type: String, required: true ,minLength:[10, 'Description must be at least 10 caracters long.']},
    genre: { type: String, required: true ,minLength:[2, 'Genre must be at least 2 caracters long.']},
    platform: {
        type: String,
        required: true,
        enum: {
            values: ['PC', 'Nintendo', 'PS4', 'PS5','XBOX'],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        }
    },
    boughtBy: {type:[Types.ObjectId],ref:'User',default:[]},
    owner:{type:Types.ObjectId,ref:'User'}
});

const Game = model('Game', gameSchema);

module.exports = Game;