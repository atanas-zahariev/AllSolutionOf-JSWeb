const {Schema,model} = require('mongoose');


const userSchema = new Schema({

    name:{type:String,required:true},

    username: {type: String,  
        minLength:[5, 'Username must be at least 5 characters'], 
    },

    hashedPassword:{type:String, required: true,}
})

userSchema.index({username:1},{
    collation:{
        locale: 'en',
        strength: 2
    }
})

const User = model('User',userSchema);

module.exports = User;