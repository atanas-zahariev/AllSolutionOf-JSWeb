const {Schema,model} = require('mongoose');


const userSchema = new Schema({
    email:{type:String,required:true},
    hashedPassword:{type:String, required: true},
    gender:{type:String,required:true},

})

userSchema.index({username:1},{
    collation:{
        locale: 'en',
        strength: 2
    }
});

const User = model('User',userSchema);

module.exports = User;