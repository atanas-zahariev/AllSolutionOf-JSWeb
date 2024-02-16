const authController = require("../controlers/authControler");
const defaultControler = require("../controlers/defayultControler");
const homeControler = require("../controlers/homeControler");
const itemControler = require("../controlers/itemControler");

module.exports = (app) => {
    app.use('/', homeControler);
    app.use('/auth', authController);
    app.use('/crypto',itemControler);
    

    app.use('*',defaultControler);
}

