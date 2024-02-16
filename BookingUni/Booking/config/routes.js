const authController = require("../controlers/authControler");
const homeControler = require("../controlers/homeControler");
const hotelControler = require("../controlers/hotelControler");
const profileControler = require("../controlers/profileControler");
const { hasUser } = require("../middlewares/guards");

module.exports = (app) => {
    app.use('/', homeControler);
    app.use('/auth', authController);
    app.use('/hotel',hasUser(), hotelControler);
    app.use(profileControler);

    // начин  за глобално прихващане на грешки ,което не може да работи асинхронно,и затова не се използва.
    //  \/
    //  \/
    // app.get('/error', (req, res, next) =>{
    //     next(new Error('propagating error'))
    // })

    // app.use((err, req, res, next) => {
    //     console.log('Global error handling')
    //     console.log(err.message);
    //     res.redirect('/')
    // })
}

