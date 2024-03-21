const ProductManager = require('../controllers/ProductManager');
const express = require('express');
const router = express.Router();

const productsManager = new ProductManager('./src/models/products.json');

router.get('/products', async (request, response) => {
    try {
        const products = await productsManager.getProducts();
        let limit = parseInt(request.query.limit);
        if (limit >= 1) {
            let newProducts = products.slice(0, limit);
            return response.send(newProducts);
        }

        return response.status(200).send(products);
    }
    catch (error){
            response.status(500).send({ message: `FILE NOT FOUND ${error}` })
    }

});

router.get('/products/:pid', async (request, response) => {
    try {
        const products = await productsManager.getProducts();
        let id = parseInt(request.params.pid);
        let newProduct = products.find(e => e.id === id)
        if (newProduct) {
            return response.status(200).send(newProduct)
        }
        return response.status(404).send(`ERROR PRODUCT (${id}) NOT FOUND`);
    }
    catch {
        (error => {
            response.status(500).send({ message: `FILE NOT FOUND ${error}` })
        })
    }
});

router.post('/products', async (request, response) => {
    const { title, description, price, thumbnail, code, stock, status, category } = request.body;
    try {
        await productsManager.addProduct(title, description, price, thumbnail, code, stock, status, category);
        response.status(200).send({ message: `SUCCESS PRODUCTO AGREGADO` })
    } catch (error) {
        response.status(500).send({ message: `ERROR AL AGREGAR EL ARTICULO: ${error.message}` });
    }

})

router.put('/products/:pid', async (request,response)=>{
let id = parseInt(request.params.pid);
const {property,value} = request.body;
try {
    await productsManager.updateProduct(id,{property,value});
    response.status(200).send({message: 'PRODUCTO ACTUALIZADO'});
} catch (error) {
    response.status(404).send({message: `ERROR AL ACTUALIZAR EL PRODUCTO: ${error}`});
}
})

router.delete('/products/:pid', async (request,response)=>{
    let id = parseInt(request.params.pid)
    try {
        await productsManager.deleteProduct(id);
        response.status(200).send({message:'PRODUCTO ELIMINADO CORRECTAMENTE'})
    } catch (error) {
        response.status(404).send({message:`ERROR AL ELIMINAR EL PRODUCTO: ${error}`})
    }
})

module.exports = router;