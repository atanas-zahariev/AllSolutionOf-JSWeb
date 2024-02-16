const { Schema, model } = require('mongoose');

// Todo add user properties and validation according to assignment

const userSchema = new Schema({   
    username: { type: String, required: true,  minLength: [4, 'Username must be at least 4 characters'] },
    hashedPassword: { type: String, required: true },
    address: { type: String, required: true, maxLength: [20, 'Addres must be at most 20 characters.'] }
});

// userSchema.index({ username: 1 }, {
//     collation: {
//         locale: 'en',
//         strength: 2
//     }
// })

const User = model('User', userSchema);

module.exports = User