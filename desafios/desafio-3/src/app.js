const express = require('express');
const ProductManager = require('./ProductManager');
const PUERTO = 8080;
const app = express();
const productsManager = new ProductManager('./src/products.json');


app.get("/", (request, response) => {
    response.send("HOME");

})

app.get('/products', async (request, response) => {
    try {
        const products = await productsManager.getProducts();
        let limit = parseInt(request.query.limit);
        if (limit >= 1) {
            let newProducts = products.slice(0, limit);
            return response.send(newProducts);
        }

        return response.send(products);
    }
    catch {
        (error => {
            console.log(`ERROR AL LEER EL ARCHIVO ${error}`)
        })
    }

})

app.get('/products/:id' , async (request, response) =>{
    try {
        const products = await productsManager.getProducts();
        let id = parseInt(request.params.id);
        let newProduct = products.find(e => e.id === id)
        if (newProduct){
            return response.send(newProduct)
        }
        return response.send(`ERROR PRODUCT (${id}) NOT FOUND`);
    }
    catch {
        (error => {
            console.log(`ERROR AL LEER EL ARCHIVO ${error}`)
        })
    }
})

app.listen(PUERTO, () => {
    console.log(`Escuchando puerto http//localhost:${PUERTO}`);
})