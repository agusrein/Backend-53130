const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const express = require('express');
const app = express();
const PUERTO = 8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api', productsRouter);
app.use('/api', cartsRouter);

app.listen(PUERTO, () => {
    console.log(`Escuchando puerto http//localhost:${PUERTO}`);
})
