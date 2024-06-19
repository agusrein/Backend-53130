const socket = require('socket.io');
const MessageModel = require('../models/messages.model.js');
// const productManager = require('../controllers/ProductManager.js');
// const ProductManager = new productManager();


class SocketManager { 
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.init();
    }

    async init() {
        this.io.on("connection", async (socket) => {
            console.log('usuario conectado');

            socket.on("message", async data => {
                await MessageModel.create(data);

                const messages = await MessageModel.find();
                this.io.sockets.emit("message", messages);
            })

           
            // socket.emit("products", await ProductManager.renderProducts);

            // socket.on("deleteProduct", async (id) => {
            //     await productManager.deleteProduct(id);
            //     socket.emit("products", await ProductManager.getProducts);
            // })
            // socket.on("addProduct", async (product) => {
            //     const result = await ProductManager.addProduct(
            //         product.title,
            //         product.description,
            //         product.price,
            //         product.thumbnail,
            //         product.code,
            //         product.stock,
            //         product.status,
            //         product.img,
            //         product.category
            //     );
            //     if (result.status) {
            //         console.log(result.message);
            //         socket.emit('products', await ProductManager.getProducts);
            //     } else {
            //         console.error(result.message);
            //     }
            // })
        })
    }
}

module.exports = SocketManager;