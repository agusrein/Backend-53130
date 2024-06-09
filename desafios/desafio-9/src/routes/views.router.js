const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');
const productsManager = new ProductManager();
const CartManager = require('../controllers/CartManager');
const cartManager = new CartManager();
const passport = require('passport');
const {jwtAuth} = require('../config/passport.config.js')

router.get('/products',passport.authenticate('jwt', { session: false }), productsManager.renderProducts)


router.get("/realtimeproducts", (request, response) => {
    try {
        response.render('realtimeproducts')
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
})

router.get("/chat", async (req, res) => {
    res.render("messages");
})

router.get("/carts/:cid", cartManager.renderCart)//6633aeb7cab032e9126855da ID TEST

router.get("/login", (req,res) =>{
res.render("login")
})

router.get("/register", (req,res) =>{
    res.render("register")
})

router.get("/profile", jwtAuth, (req, res) => {
    return res.render("profile", { user: req.user.user });
});
module.exports = router;