const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const ProductManager = require('./controllers/ProductManager');
const express = require('express');
const app = express();
const PUERTO = 8080;
const exphbs = require('express-handlebars');
require('./database.js')

const productManager = new ProductManager('./src/models/products.json');



//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

//ROUTES
app.use('/api', productsRouter);
app.use('/api', cartsRouter);
app.use('/', viewsRouter);


//HANDLEBARS
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.get("/", (req, res) => {
    res.render("home");
});


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando puerto http//localhost:${PUERTO}`);
})


//WEBSOCKET
const {Server} = require('socket.io');
const io = new Server(httpServer);


io.on('connection',async (socket)=>{
    socket.emit("products", await productManager.getProducts());
    socket.on("deleteProduct" , async (id) =>{
        await productManager.deleteProduct(id);
        socket.emit("products", await productManager.getProducts());
    })
    socket.on("addProduct", async (product) =>{
        const result = await productManager.addProduct(
            product.title,
            product.description,
            product.price,
            product.thumbnail, 
            product.code,
            product.stock,
            product.status,
            product.category
        );
        if (result.status) {
            console.log(result.message); 
            socket.emit('products', await productManager.getProducts());
        } else {
            console.error(result.message); 
        }
    })
})


