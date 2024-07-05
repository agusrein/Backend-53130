
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {COOKIETOKEN, JWTKEY} = require('../config/config.js')



router.get("/logout", (req, res) => {
    const token = req.cookies[COOKIETOKEN];
    if (token) {
        res.clearCookie(COOKIETOKEN);
        return res.redirect("/login");
    } else {
        return res.redirect("/login");
    }
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).render('login', { message: info.message });
        }
        const token = jwt.sign({ user },JWTKEY, { expiresIn: '1d' })
        res.cookie(COOKIETOKEN, token, {
            httpOnly: true,
            mxAge: 3600000
        })
        return res.redirect("/products"); //CURRENT
    })(req, res, next);
});

router.get('/github',passport.authenticate('github',{scope: ["user:email"]}),async (req,res)=>{})

router.get('/sessions/githubcallback', passport.authenticate('github',{
    failureRedirect : '/login',
    session: false 
}),async(req,res)=>{
    const user = req.user;
    const token = jwt.sign({user},JWTKEY,{expiresIn:'1d'})
        res.cookie(COOKIETOKEN,token,{
            httpOnly:true,
            mxAge: 3600000
        })
    res.redirect('/products') // CURRENT
})



module.exports = router;