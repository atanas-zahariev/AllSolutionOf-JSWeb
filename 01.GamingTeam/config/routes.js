const authController = require("../controlers/authControler");
const defaultControler = require("../controlers/defaultControler");
const gameControler = require("../controlers/gameControler");
const homeControler = require("../controlers/homeControler");
const { hasUser } = require("../middlewares/guards");

module.exports = (app) => {
    app.use('/', homeControler);
    app.use('/auth', authController);
    app.use('/game',hasUser(), gameControler);

    app.use('*',defaultControler )
}

