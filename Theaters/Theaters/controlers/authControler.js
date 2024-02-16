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
    async (req, res) => {
        const regexP = /^[A-Za-z0-9]+$/
        
        try {
             
            if (req.body.username == '' || req.body.password == '') {
                throw new Error('All fields are required')
            }

            if(req.body.password.length < 3 || !regexP.test(req.body.password)){
                throw new Error('The password should be at least 3 characters long and should consist only english letters and digits')
            }

            if (req.body.password != req.body.repass) {
                throw new Error('Passwords don\'t match');
            }

            const token = await register(req.body.username, req.body.password);

            res.cookie('token', token);
            res.redirect('/') 
        } catch (error) {
            
            const errors = parseError(error)
            
            res.render('register', {
                errors              
            })
        }

    })

authController.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login Page'
    })
})

authController.post('/login', async (req, res) => {
    try {
        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token)
        res.redirect('/')  
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

