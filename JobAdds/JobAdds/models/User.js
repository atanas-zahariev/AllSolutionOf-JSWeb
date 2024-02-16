const { Schema, model } = require('mongoose');



const userSchema = new Schema({
    email: { type: String, required: true },

    hashedPassword: { type: String, required: true },

    skills: { type: String, required: true, maxLength: [40, 'The description of skills should be a maximum of 40 characters long'] },

})


const User = model('User', userSchema);

module.exports = User