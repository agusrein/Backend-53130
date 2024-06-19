const roleCheck = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            req.unauthorized = true;
            next();
        }
    };
};

module.exports = roleCheck;