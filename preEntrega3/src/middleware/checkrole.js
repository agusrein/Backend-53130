const roleCheck = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            req.unauthorized = true;
            res.render('unauthorized')
            next();
        }
    };
};

module.exports = roleCheck;