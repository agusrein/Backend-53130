const fs = require('fs');

class CartManager {
    static id = 0;
    constructor(path) {
        this.path = path;
        this.products = [];
        this.carts = [];
        this.readFile();
    }

    readFile() {
        const data = fs.readFileSync(this.path, "utf-8");
        if (data) {
            console.log('SE LEYÓ');
            this.carts = JSON.parse(data);
            CartManager.id = this.carts[this.carts.length - 1].id;
        };
        return this.carts;
    }

    async createCart() {
        const newCart = { ...this.products, id: ++CartManager.id }
        this.carts.push(newCart);
        await fs.promises.writeFile((this.path, JSON.stringify(this.carts, null, 2)));
        await this.readFile();
        return newCart;
    }

    async getProductsByCart(id) {
        try {
            const cartFound = this.carts.find(e => e.id == id);
            if (cartFound) {
                return cartFound;
            }
        } catch (error) {
            throw new Error(`ERROR Not Found : ${id}`)
        }
    }

    async addProductToCart(id, product, quantity) {
        const cartFound = this.carts.find(e => e.id == id);
        if(cartFound){
            const existingProduct = cartFound.this.products.find(e=>e.id == product);
            existingProduct? existingProduct.quantity +=quantity : cartFound.this.products.push({id:product,quantity});
        }
        else{
            throw new Error(`ERROR Not Found : ${id}`);
        }
        await fs.promises.writeFile((this.path, JSON.stringify(this.carts, null, 2)));
        await this.readFile();
    }

}

module.exports = CartManager;
