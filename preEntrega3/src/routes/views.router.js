const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');
const productsManager = new ProductManager();
const CartManager = require('../controllers/CartManager');
const cartManager = new CartManager();
const passport = require('passport');
const jwtAuth = require('../middleware/jwtAuthenticate.js');
const roleCheck = require('../middleware/checkrole.js');

router.get('/products',passport.authenticate('jwt', { session: false }),jwtAuth, productsManager.renderProducts)


router.get("/realtimeproducts",jwtAuth,roleCheck('admin'), (request, response) => {
    try {
        if(request.unauthorized){
           return response.render('unauthorized');
        }
        return response.render('realtimeproducts');
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
})

router.get("/chat",jwtAuth,roleCheck('user'), async (req, res) => {
    try {
        if(req.unauthorized){
            return res.render('unauthorized')
        }
         return res.render("messages", {user: req.user});
    } catch (error) {
        
    }
    
})

router.get("/carts/:cid", cartManager.renderCart)//6633aeb7cab032e9126855da ID TEST

router.get("/login", (req,res) =>{
res.render("login")
})

router.get("/register", (req,res) =>{
    res.render("register")
})

router.get("/profile", jwtAuth, (req, res) => {
    return res.render("profile", { user: req.user});
});


module.exports = router;