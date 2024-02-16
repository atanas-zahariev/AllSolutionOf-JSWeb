const authController = require("../controlers/authControler");
const homeControler = require("../controlers/homeControler");
const itemControler = require("../controlers/itemControler");
const { hasUser } = require("../middlewares/guards");

module.exports = (app) => {
    app.use('/', homeControler);
    app.use('/auth', authController);
    app.use('/theater',hasUser(),itemControler);

   
}

