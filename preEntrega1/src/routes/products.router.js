const ProductManager = require('../controllers/ProductManager');
const express = require('express');
const router = express.Router();

const productsManager = new ProductManager('./src/models/products.json');

router.get('/products', async (request, response) => {
    try {
        const products = await productsManager.getProducts();
        let limit = parseInt(request.query.limit);
        if (limit >= 1) {
            let newProducts = products.products.slice(0, limit);
            return response.status(200).send({ products: newProducts });
        }

        return response.status(200).send({ products: products.products });
    }
    catch (error) {
        response.status(500).send({ message: error.message });
    }

});

router.get('/products/:pid', async (request, response) => {
    try {
        let id = parseInt(request.params.pid);
        let product = await productsManager.getProductById(id);
        product.status ? response.status(200).send({ message: product.message, product: product.product }) : response.status(404).send({ message: product.message })

    }
    catch {
        response.status(500).send({ message: error.message });
    }
});

router.post('/products', async (request, response) => {
    const { title, description, price, thumbnail, code, stock, status, category } = request.body;
    try {
        const result = await productsManager.addProduct(title, description, price, thumbnail, code, stock, status, category);
        result.status ? response.status(200).send({ message: result.message }) : response.status(404).send({ message: result.message })
    } catch (error) {
        response.status(500).send({ message: `ARTICULO NO AGREGADO: ${error.message}` });
    }

})

router.put('/products/:pid', async (request, response) => {
    let id = parseInt(request.params.pid);
    const { property, value } = request.body;
    try {
        const result = await productsManager.updateProduct(id, { property, value });
        result.status ? response.status(200).send({ message: result.message }) : response.status(404).send({ message: result.message })
    } catch (error) {
        response.status(500).send({ message: `ERROR AL ACTUALIZAR EL PRODUCTO: ${error.message}` });
    }
})

router.delete('/products/:pid', async (request, response) => {
    let id = parseInt(request.params.pid)
    try {
        const result = await productsManager.deleteProduct(id);
        result.status ? response.status(200).send({ message: result.message }) : response.status(404).send({ message: result.message })

    } catch (error) {
        response.status(500).send({ message: `ERROR AL ELIMINAR EL PRODUCTO: ${error.message}` })
    }
})

module.exports = router;