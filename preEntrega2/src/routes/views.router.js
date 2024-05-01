const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');
const productsManager = new ProductManager();

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

module.exports = router;