const { Schema, model } = require('mongoose');

// Todo add user properties and validation according to assignment

const userSchema = new Schema({
    email: {type: String,required: true,minLength:[10,'The email is required and should be at least 10 characters long.']},
    hashedPassword: { type: String, required: true }
})

// userSchema.index({ username: 1 }, {
//     collation: {
//         locale: 'en',
//         strength: 2
//     }
// })

const User = model('User', userSchema);

module.exports = User