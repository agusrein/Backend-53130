const ProductManager = require('../controllers/ProductManager');
const express = require('express');
const router = express.Router();


const productsManager = new ProductManager();

router.get('/products', async (request, response) => {
    try {
        let page = parseInt(request.query.page) || 1;
        let limit = parseInt(request.query.limit) || 10;
        let query = request.query.category || null;
        let sort = parseInt(request.query.sort) || 1;

        const products = await productsManager.getProducts({page,limit,query,sort});     
            return response.status(200).json(
                {   
                    status: 'success',
                    payload: products.docs,
                    totalPages: products.totalPages,
                    prevPage: products.prevPage,
                    nextPage: products.nextPage,
                    page: products.page,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
                    nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
                }
            );
    }
    catch (error) {
        response.status(500).send({ message:error.message});
    }

});

router.get('/products/:pid', async (request, response) => {
    try {
        let id = request.params.pid;
        let product = await productsManager.getProductById(id);
        product.status ? response.status(200).send({message: product.message, product: product.product}) : response.status(404).send({message: product.message})
  
    }
    catch {
        response.status(500).send({ message: error.message });
    }
});

router.post('/products', async (request, response) => {
    const { title, description, price, thumbnail, code, stock, status, img, category } = request.body;
    try {
       const result = await productsManager.addProduct(title, description, price, thumbnail, code, stock, status,img , category);
        result.status ? response.status(200).send({ message: result.message }) : response.status(404).send({message: result.message})
    } catch (error) {
        response.status(500).send({ message: `ARTICULO NO AGREGADO: ${error.message}` });
    }

})

router.put('/products/:pid', async (request, response) => {
    let id = request.params.pid;
    const { property, value } = request.body;
    try {
       const result = await productsManager.updateProduct(id, { property, value });
       result.status ? response.status(200).send({ message: result.message }) : response.status(404).send({message: result.message})
    } catch (error) {
        response.status(500).send({ message: `ERROR AL ACTUALIZAR EL PRODUCTO: ${error.message}` });
    }
})

router.delete('/products/:pid', async (request, response) => {
    let id = request.params.pid;
    try {
        const result = await productsManager.deleteProduct(id);
        result.status ? response.status(200).send({ message: result.message }) : response.status(404).send({message: result.message})
    
    } catch (error) {
        response.status(500).send({ message: `ERROR AL ELIMINAR EL PRODUCTO: ${error.message}` })
    }
})

module.exports = router;