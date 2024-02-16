
function hasUser() {
    return (req, res, next) => {
        if (req.user != undefined) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

function isGuest(){
    return (req,res,next) => {
        if (req.user != undefined) {
            res.redirect('/');
        } else {
            next();
        }
    }
};


module.exports = {
    hasUser,
    isGuest
}