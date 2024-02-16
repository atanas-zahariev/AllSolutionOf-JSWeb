const {Schema,model} = require('mongoose');


const userSchema = new Schema({
    username: {type: String,  
        minLength:[5, 'Username must be at least 5 characters'], 
        match:[/^[a-zA-Z0-9]+/i, 'Username must contain only number and english letters']       
    },
    hashedPassword:{type:String,required: true}
})

userSchema.index({username:1},{
    collation:{
        locale: 'en',
        strength: 2
    }
})

const User = model('User',userSchema);

module.exports = User;