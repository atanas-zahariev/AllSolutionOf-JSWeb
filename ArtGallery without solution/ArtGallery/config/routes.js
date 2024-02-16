const authController = require("../controlers/authControler");
const defaultControler = require("../controlers/defaultControler");
const homeControler = require("../controlers/homeControler");
const itemControler = require("../controlers/itemControler");
const { hasUser } = require("../middlewares/guards");

module.exports = (app) => {
    app.use('/', homeControler);
    app.use('/auth', authController);
    app.use('/galery',itemControler);

    app.use(defaultControler);
}

