const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User")

const JWT_SECRET = 'sjbadofkala56lkfvj'


async function register(email,username, password) {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        throw new Error('Username already taken')
    }
    const existinEmail = await User.findOne({ email });

    if (existinEmail) {
        throw new Error('Email already taken')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        username,
        hashedPassword
    });

    const token = createSession(user);

    return token;

}

async function login(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Username or Password don\'t match')
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (hasMatch == false) {
        throw new Error('Username or Password don\'t match')
    };

    const token = createSession(user);

    return token;
}


 function createSession({_id,username}) {
    const payload = {
        _id,
        username
    }
    const token = jwt.sign(payload, JWT_SECRET)

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