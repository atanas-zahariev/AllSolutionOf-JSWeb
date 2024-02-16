const { register, login } = require('../services/userService');
const errorParser = require('../utyl/parser');
const { body, validationResult } = require('express-validator')

const authControler = require('express').Router();

authControler.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register Page'
    })
})

authControler.post('/register',
    body('email').isEmail({ allow_utf8_local_part: false }).withMessage('Invalid Email'),

    async (req, res) => {
        try {
            const { email, firstname, lastname, password, repass } = req.body;

            const { errors } = validationResult(req)
            if (errors.length > 0) {
                throw errors;
            }
            if (password.length < 5) {
                throw new Error('Password must be at least 5 characters.')
            }


            if (password != repass) {
                throw new Error('Passwords don\'t match');
            }

            const token = await register(req.body.email, firstname, lastname, req.body.password);

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