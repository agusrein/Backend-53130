const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {COOKIETOKEN, JWTKEY} = require('../config/config.js')



router.post("/register", async (req, res, next) => {
    passport.authenticate("register", async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).render("register", { message: info.message });
        }
        const token = jwt.sign({user},JWTKEY,{expiresIn:'1d'})
        res.cookie(COOKIETOKEN,token,{
            httpOnly:true,
            mxAge: 3600000
        })
        res.redirect('/products'); //CURRENT
    })(req, res, next);
});

module.exports = router;