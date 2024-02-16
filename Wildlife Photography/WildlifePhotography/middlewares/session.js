const { verifiToken } = require("../services/userService")

module.exports = () => (req, res, next) => {
    const token = req.cookies.token

    if (token) {        
        try {
            const userData = verifiToken(token);
            req.user = userData;
            res.locals.username = req.user.username;
        } catch (err) {
            res.clearCookie('token');
            res.redirect('/auth/login');
            return;
        }
    }

    next()
}