class ProductManager {

    constructor(products = []) {
        this.products = products;
    }

    addProduct(product, id) {

        if (this.products.find(e => e.code === product.code)) {
            return console.log(`ERROR el producto con el codigo ${product.code}, ya se encuentra ingresado.`)
        }
        else if (!product.title || !product.description || !product.price || !product.thumbnail || !product.stock) {
            return console.log('ERROR debe llenar todos los datos para ingresar un artículo')
        }
        return (
            this.products.push({ ...product, id: id }))

    }

    getProducts() {
        return console.log('Productos Encontrados : ', ...this.products)
    }

    getProductById(id) {
        const findProduct = this.products.find(e => e.id === id);
        findProduct ? console.log(findProduct) : console.log(`No se encontró el elemento : ${id}`);
    }
}

class Product {
    static id = 0;
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = Product.getId();
    }

    static getId() {
        return ++Product.id;
    }
}

const products = new ProductManager;

product1 = new Product('Primer Producto', 'Descripcion del primer producto', 15000, './img/imagen.jpg', '02356', 200);
product2 = new Product('Segundo Producto', 'Descripcion del segundo producto', 9000, './img/imagen.jpg', '02c87', 200);
product3 = new Product('Tercer Producto', 'Descripcion del tercer producto', 7850, './img/imagen.jpg', '02356', 200); //Producto prueba con codigo repetido codigo
product4 = new Product('Cuarto Producto', 'Descripcion del cuarto producto', 23050, '05tf0', 200); //Producto prueba con falta de información.


products.addProduct(product1, product1.id);
products.addProduct(product2, product2.id);
products.addProduct(product3, product3.id);
products.addProduct(product4, product4.id);

products.getProducts();

products.getProductById(5);
