const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User")

const JWT_SECRET = 'sjbadofkala56lkfvj'


async function register(name,username, password) {
    const existing = await User.findOne({ username }).collation({locale:'en',strength:2});

    if (existing) {
        throw new Error('Username already taken')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        username,
        hashedPassword
    });

    const token = createSession(user);

    return token;

}

async function login(username, password) {
    const user = await User.findOne({ username }).collation({locale:'en',strength:2});

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