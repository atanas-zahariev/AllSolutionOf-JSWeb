const { register, login } = require('../services/userService');
const errorParser = require('../utyl/parser');
const {body,validationResult} = require('express-validator')

const authControler = require('express').Router();

authControler.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register Page'
    })
})

authControler.post('/register',
body('email').isEmail().withMessage('Invalid Email'), 
async (req, res) => {
    try {
        const {errors} = validationResult(req)
        if(errors.length > 0){
           
            throw errors
        }
        const { username, password, repass } = req.body;
        if (username == '' || password == '' ) {
            throw new Error('All fields are required')
        }

        if(password.length < 4){
            throw new Error('Password must be at least 4 charcters,')
        }

        if (password != repass) {
            throw new Error('Passwords don\'t match');
        }

        const token = await register(req.body.email,req.body.username, req.body.password);

        res.cookie('token', token);
        res.redirect('/')

    } catch (error) {
        res.render('register', {
            error: errorParser(error)          
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
            error: errorParser(error)          
        })
    }
})

authControler.get('/logout', (req,res) => {
    res.clearCookie('token');
    res.redirect('/')
});

module.exports = authControler;