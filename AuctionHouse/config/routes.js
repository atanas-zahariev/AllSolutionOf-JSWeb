const authControler = require("../controlers/authControler");
const defaultControler = require("../controlers/defaultControler");
const homeControler = require("../controlers/homeControler");
const itemControler = require("../controlers/itemControler");

module.exports = (app) => {
    app.use(homeControler);
    app.use('/auth', authControler);
    app.use('/house', itemControler);

    //add defaultControler last!

    app.use(defaultControler);
}
