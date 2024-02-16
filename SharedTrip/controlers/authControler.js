const { register, login } = require('../services/userService');
const errorParser = require('../utyl/parser');
const { body, validationResult } = require('express-validator')

const authControler = require('express').Router();

authControler.get('/register', (req, res) => {
    res.render('register')
})

authControler.post('/register',
    body('email').isEmail().withMessage('Invalid email'),
    async (req, res) => {
        try {
            const { errors } = validationResult(req)

            if (errors.length > 0) {
                throw errors
            }

            const { email, password, repass } = req.body;

            if (email == '' || password == '' ) {
                throw new Error('All fields are required')
            }

            if (password.length < 5) {
                throw new Error('Pasword must be at least 5 characters.')
            }

            if (password != repass) {
                throw new Error('Passwords don\'t match');
            }

            const token = await register(req.body.email, req.body.password,req.body.gender);

            res.cookie('token', token);
            res.redirect('/')

        } catch (error) {
            res.render('register', {
                error: errorParser(error),               
            })
        }

    })

authControler.get('/login', (req, res) => {
    res.render('login')
});

authControler.post('/login', async (req, res) => {
    try {
        const token = await login(req.body.email, req.body.password);

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
})

authControler.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
})

module.exports = authControler;