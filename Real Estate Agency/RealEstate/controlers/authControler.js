const { register, login } = require('../services/userService');
const errorParser = require('../utyl/parser');

const authControler = require('express').Router();

authControler.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register Page'
    })
})

authControler.post('/register', async (req, res) => {
    try {
        const { name,username, password, repass } = req.body;

        const regexForName = /[A-Za-z]+\s[A-Za-z]+/g

        if(!regexForName.test(name)){
            throw new Error('Name content must be with First and Last name.')
        }

        if (username == '' || password == '') {
            throw new Error('All fields are required')
        }


        if(password.length < 4){
            throw new Error('Password must be at least 4 characters.')
        }

        if (password != repass) {
            throw new Error('Passwords don\'t match');
        }

        const token = await register(req.body.name,req.body.username, req.body.password);

        res.cookie('token', token);
        res.redirect('/')

    } catch (error) {
        res.render('register', {
            error: errorParser(error),           
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
            error: errorParser(error),           
        })
    }
})

authControler.get('/logout', (req,res) => {
    res.clearCookie('token');
    res.redirect('/')
})

module.exports = authControler;