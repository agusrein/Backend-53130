const fs = require('fs');


class CartManager {

    constructor(path) {
        this.path = path;
        this.carts = [];
        this.id = 0;
        this.readFile();
    }
    readFile() {
        const data = fs.readFileSync(this.path, "utf-8");
        if (data) {
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.id = this.carts[this.carts.length - 1].id
            }
        }
        return this.carts

    }

    async createCart() {
        try {
            const newCart = { products: [], id: ++this.id }
            this.carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            return { status: true, message: `Carrito Creado` }

        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }

    async getProductsByCart(id) {
        try {
            const cartFound = this.carts.find(e => e.id == id);
            if (cartFound) {
                return { status: true, message: 'Carrito encontrado:', cart: cartFound };
            }
            return { status: false, message: `ERROR Not Found : ${id}` }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }

    async addProductToCart(id, productId, quantity) {
        try {
            const cartFound = this.carts.find(e => e.id == id);
            if (cartFound) {
                const existingProduct = cartFound.products.find(e => e.id == productId);
                existingProduct ? existingProduct.quantity += quantity : cartFound.products.push({ id: productId, quantity: quantity });
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
                return { status: true, message: 'Producto Agregado' }
            }
            else {
                return { status: false, message: `ERROR Not Found : ${id}` }
            }
        }
        catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }

}

module.exports = CartManager;