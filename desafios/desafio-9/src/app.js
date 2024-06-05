const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/user.router.js');
const sessionsRouter = require('./routes/session.router.js')
const express = require('express');
const app = express();
const {PUERTO} = require('./config/config.js');
const exphbs = require('express-handlebars');
const socket = require('socket.io');
const passport = require('passport');
const {initializePassport} = require('./config/passport.config.js');
const cookieParser = require('cookie-parser');
require('./database.js')





//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());



//ROUTES
app.use('/api', productsRouter);
app.use('/api', cartsRouter);
app.use('/api', sessionsRouter);
app.use('/api', usersRouter);
app.use('/', viewsRouter);


//HANDLEBARS
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");



const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando puerto http//localhost:${PUERTO}`);
})


//WEBSOCKET
const io = new socket.Server(httpServer);
const MessageModel = require('./models/messages.model.js');

io.on("connection", (socket) =>{
    console.log('usuario conectado');
    socket.on("message", async data =>{
        await MessageModel.create(data);

        const messages = await MessageModel.find();
        io.sockets.emit("message", messages);
    })
})

// io.on('connection',async (socket)=>{
//     socket.emit("products", await productManager.getProducts());
//     socket.on("deleteProduct" , async (id) =>{
//         await productManager.deleteProduct(id);
//         socket.emit("products", await productManager.getProducts());
//     })
//     socket.on("addProduct", async (product) =>{
//         const result = await productManager.addProduct(
//             product.title,
//             product.description,
//             product.price,
//             product.thumbnail, 
//             product.code,
//             product.stock,
//             product.status,
//             product.img,
//             product.category
//         );
//         if (result.status) {
//             console.log(result.message); 
//             socket.emit('products', await productManager.getProducts());
//         } else {
//             console.error(result.message); 
//         }
//     })
// })




