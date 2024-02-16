const authControler = require("../controlers/authControler");
const defaultControler = require("../controlers/defaultControler");
const homeControler = require("../controlers/homeControler");
const itemControler = require("../controlers/itemControler");
const profileControler = require("../controlers/profileControler");
const { hasUser } = require("../middlewares/guard");

module.exports = (app) => {
    app.use(homeControler);
    app.use('/auth', authControler);
    app.use('/book', hasUser(), itemControler);
    app.use(hasUser(), profileControler);


    //add defaultControler last!

    app.use(defaultControler);
};
