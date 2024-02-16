const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User")

const JWT_SECRET = 'sjbadofkala56lkfvj'


async function register(email, password,gender) {
    const existing = await User.findOne({ email })

    if (existing) {
        throw new Error('Email already taken')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        hashedPassword,
        gender
    });

    const token = createSession(user);

    return token;

}

async function login(email, password) {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Email or Password don\'t match')
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (hasMatch == false) {
        throw new Error('Email or Password don\'t match')
    };

    const token = createSession(user);

    return token;
}


 function createSession({_id,email}) {
    const payload = {
        _id,
        email
    }
    const token = jwt.sign(payload, JWT_SECRET)

    return token;
}

 function verifiToken(token) {
    return jwt.verify(token, JWT_SECRET);
    
}

async function getUser(id){
    return await User.findById(id).lean()
}

module.exports = {
    register,
    login,
    verifiToken,
    getUser
}