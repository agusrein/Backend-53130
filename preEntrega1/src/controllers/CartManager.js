const fs = require('fs');


class CartManager {

    constructor(path) {
        this.path = path;
        this.carts = [];
        this.id = 0;
        this.readFile();
    }
    readFile(){
        const data = fs.readFileSync(this.path, "utf-8");
        if(data){
            this.carts = JSON.parse(data);
            if(this.carts.length>0){
                this.id = this.carts[this.carts.length -1].id
            }
        }
        return this.carts
        
    }

    async createCart() {
        const newCart = { products: [], id: ++this.id}
        this.carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
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

    async addProductToCart(id, productId, quantity) {
        const cartFound = this.carts.find(e => e.id == id);
        if (cartFound) {
            const existingProduct = cartFound.products.find(e => e.id == productId);
            existingProduct ? existingProduct.quantity += quantity : cartFound.products.push({ id: productId, quantity: quantity });

        }
        else {
            throw new Error(`ERROR Not Found : ${id}`);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));

    }

}

module.exports = CartManager;