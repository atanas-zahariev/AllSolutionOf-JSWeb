const authControler = require("../controlers/authControler");
const defaultControler = require("../controlers/defaultControler");
const homeControler = require("../controlers/homeControler");
const itemControler = require("../controlers/itemControler");
const { hasUser } = require("../middlewares/guard");

module.exports = (app) => {
    app.use(homeControler);
    app.use('/auth', authControler);
    app.use('/trips',  itemControler);

    //add defaultControler last!

    app.use(defaultControler);
}
