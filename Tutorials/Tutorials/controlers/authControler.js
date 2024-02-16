const { register, login } = require('../services/userService');
const errorParser = require('../utyl/parser');

const authControler = require('express').Router();

authControler.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register Page'
    })
})

authControler.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        const { username, password, repass } = req.body;
        if (username == '' || password == '' || repass == '') {
            throw new Error('All fields are required')
        }

        if (password != repass) {
            throw new Error('Passwords don\'t match');
        }

        const regexForPassword = /^[a-zA-Z0-9]+/i
        console.log(regexForPassword.test('123'));

        if ((regexForPassword.test(password) == false)) {
            throw new Error('Password must contain only number and english letters.')
        }

        if (password.length < 5) {
            throw new Error('Password must be at least 5 characters.')
        }

        const token = await register(req.body.username, req.body.password);

        res.cookie('token', token);
        res.redirect('/')

    } catch (error) {
        res.render('register', {
            title: 'Register Page',
            error: errorParser(error),
            body: {
                username: req.body.username
            }
        })
    }

})

authControler.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login Page'
    })
})

authControler.post('/login', async (req, res) => {
    try {
        const token = await login(req.body.username, req.body.password);

        res.cookie('token', token)
        res.redirect('/')
    } catch (error) {
        res.render('login', {
            title: 'Login Page',
            error: errorParser(error),
            body: {
                username: req.body.username
            }
        })
    }
});

authControler.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
})

module.exports = authControler;

