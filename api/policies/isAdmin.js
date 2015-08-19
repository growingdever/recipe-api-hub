module.exports = function (req, res, next) {
    if (!req.user) {
        return res.forbidden('You should authenticate');
    }

    if (!req.user.isAdmin) {
        return res.forbidden('You are not an admin');
    }

    return next();
};
