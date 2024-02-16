const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");


const JWT_SECRET = 'a6d5h4s512h5aserhg4'




async function register(email, password, skills) {
    console.log(email, password, skills)
    const existingEmail = await User.findOne({ email })


    if (existingEmail) {
        throw new Error('Email is taken')
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(typeof hashedPassword == 'string' )
    const user = await User.create({
        email,
        hashedPassword,
        skills
    });
    console.log(user)
    // Todo see asigment if registration create user session

    const token = createSession(user);

    return token;
}

async function login(email, password) {
    const user = await User.findOne({ email })
    
    if (!user) {
        throw new Error('Incorrect username or password')
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (hasMatch == false) {
        throw new Error('Incorrect username or password')
    }

    const token = createSession(user);

    return token;
}

function createSession({ _id, email }) {
    const payload = {
        _id,
        username: email
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
