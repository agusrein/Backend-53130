const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');
const productsManager = new ProductManager();
const CartManager = require('../controllers/CartManager');
const cartManager = new CartManager();

router.get('/products', async (request, response) => {
    try {
        let page = parseInt(request.query.page) || 1;
        let limit = parseInt(request.query.limit) || 10;
        let query = request.query.category || null;
        let sort = parseInt(request.query.sort) || 1;
        const products = await productsManager.getProducts({ page, limit, query, sort });

        const finalProducts = products.docs.map(e => {
            const { _id, ...rest } = e.toObject();
            return rest;
        })

        response.render('home', {
            user: request.session.user,
            products: finalProducts,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        response.status(500).send({ message: error.message });
    }

})


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

router.get("/carts/:cid", async (req, res) => { //6633aeb7cab032e9126855da ID TEST
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getProductsByCart(cid);
        console.log(cart)
        if(cart.status){
            const products = cart.cart.products.map(e => ({
                product: e.product.toObject(),
                quantity: e.quantity
             }));
             res.render('carts', {cart: products} )
        }
        else{res.status(404).send({ message: cart.message });}
        
    } catch (error) {
        res.status(500).send({ message: error.message });
    }


})

router.get("/login", (req,res) =>{
res.render("login")
})

router.get("/register", (req,res) =>{
    res.render("register")
})

router.get("/profile", (req,res)=>{
    if(!req.session.login){
        return res.redirect("/login");
    }
    return res.render("profile")
})
module.exports = router;