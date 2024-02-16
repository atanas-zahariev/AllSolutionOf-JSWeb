const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");


const JWT_SECRET = 'a6d5h4s512h5aserhg4'




async function register(email,username, password) {
    const existingUser = await User.findOne({username})//.collation({locale: 'en', strength: 2});

    if(existingUser){
        throw new Error('Username is taken')
    }
    
    const existingEmail = await User.findOne({email})

    if(existingEmail){
        throw new Error('Email is taken')
    }
    
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        email,
        username,
        hashedPassword
    });

    // Todo see asigment if registration create user session

    const token = createSession(user);

    return token;
}

async function login(email,username,password) {
    //const user = await User.findOne({username}).collation({locale: 'en', strength: 2});
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Incorrect username or password')
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if(hasMatch == false){
        throw new Error('Incorrect username or password')
    }

    const token = createSession(user);
     
    return token;
}

function createSession({_id, username}) {
   const payload = {
     _id,
     username
   };

  const token = jwt.sign(payload, JWT_SECRET);

  return token;
}

function verifiToken(token) {
   return jwt.verify(token, JWT_SECRET);
}


module.exports = {
    register,
    login,
    verifiToken,
}
