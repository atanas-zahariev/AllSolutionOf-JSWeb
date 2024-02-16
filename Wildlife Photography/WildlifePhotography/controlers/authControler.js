const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router();
const { body, validationResult } = require('express-validator')

authController.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register Page'
    })
})

authController.post('/register',
    body('email').isEmail({allow_utf8_local_part:false}).withMessage('Invalid email.'),

    async (req, res) => {
        try {
            const { errors } = validationResult(req)
            if (errors.length > 0) {
                throw errors
            }

            if (req.body.firstName == '' || req.body.password == ''|| req.body.lastName == '') {
                throw new Error('All fields are required')
            }

            if(req.body.password.length < 4){
                throw new Error('Password must be at least 4 characters.')
            }

            if (req.body.password != req.body.repass) {
                throw new Error('Passwords don\'t match');
            }

            const token = await register(req.body.firstName,req.body.lastName,req.body.email, req.body.password);

            res.cookie('token', token);
            res.redirect('/') // Todo replace with redirect by assignment
        } catch (error) {
            // Todo add error parser
            const errors = parseError(error)
            // Todo add error display to actual template from assigment
            res.render('register', {
                errors              
            })
        }

    });

authController.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login Page'
    })
})

authController.post('/login', async (req, res) => {
    try {
        const token = await login(req.body.email, req.body.password);
        res.cookie('token', token)
        res.redirect('/')  // Todo replace with redirect by assignment
    } catch (error) {
        const errors = parseError(error)
        res.render('login', {
            errors          
        })
    }

})

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
})


module.exports = authController;

