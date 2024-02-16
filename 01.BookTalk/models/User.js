const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    email: { type: String, required: true, minLength: [10, 'Email must be at least 10 characters'] },

    username: {
        type: String, required: true,
        minLength: [4, 'Username must be at least 4 characters'],
    },

    hashedPassword: { type: String, required: true }
})

userSchema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', userSchema);

module.exports = User;