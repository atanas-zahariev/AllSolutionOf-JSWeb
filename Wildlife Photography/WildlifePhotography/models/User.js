const { Schema, model } = require('mongoose');

// Todo add user properties and validation according to assignment

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, 'First name must be at least 3 characters'],
        match: [/[A-Za-z]+/i, 'First name may content only anglish latters']
    },

    lastName: {
        type: String,
        required: true,
        minLength: [5, 'Last name must be at least 5 characters'],
        match: [/[A-Za-z]+/i, 'Last name may content only anglish latters']
    },

    email: { type: String, required: true },

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