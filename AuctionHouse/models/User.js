const {Schema,model} = require('mongoose');


const userSchema = new Schema({

    email:{type:String,
        required:true,
    },

    firstname: {type: String,  
        minLength:[1, 'First name must be at least 1 characters'], 
    },
    lastname: {type: String,  
        minLength:[1, 'Last name must be at least 1 characters'], 
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