const { Schema, model } = require('mongoose');

// Todo add user properties and validation according to assignment

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: [3, 'Username must be at least 3 characters'],
        match:[/^[A-Za-z0-9]+$/, 'Username should consist only english letters and digits']
    },

    hashedPassword: { 
        type: String, 
        required: true,        
     }
})

// userSchema.index({ username: 1 }, {
//     collation: {
//         locale: 'en',
//         strength: 2
//     }
// })

const User = model('User', userSchema);

module.exports = User