const { Schema, model } = require('mongoose');

// Todo add user properties and validation according to assignment

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        minLength: [10, 'Email must be at least 10 characters long.'],
        match: [/^[a-zA-Z0-9]+$/i, 'Username may contain only english letters and numbers']
    },
    username: { type: String, required: true, /*unique: true,*/ minLength: [3, 'Username must be at least 3 characters'] },
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