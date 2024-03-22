class ProductManager {
    static id = 0;
    constructor() {
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        const product = {title ,description ,price ,thumbnail ,code ,stock };

        if (this.products.find(e => e.code === product.code)) {
            console.log(`ERROR el producto con el codigo ${product.code}, ya existe.`)
            return 
        }
        else if (!product.title || !product.description || !product.price || !product.thumbnail || !product.stock){ 
        console.log('ERROR debe llenar todos los datos para ingresar un artículo')
        return 
        }
        
        else this.products.push({ ...product, id: ++ProductManager.id}); 
    }

    getProducts() {
          console.log(this.products);
          return
    }

    getProductById(id) {
        const findProduct = this.products.find(e => e.id === id);
        findProduct ? console.log(findProduct) : console.log(`ERROR Not Found : ${id}`);
    }
}


const products = new ProductManager;


products.getProducts();

products.addProduct('Producto prueba uno', 'Descripcion del producto uno' , 2400,'./public/img/foto1.png', '08uw9', 200);
products.addProduct('Producto prueba dos', 'Descripcion del producto dos' , 9400,'./public/img/foto1.png', '08349', 200);

products.getProducts();

products.addProduct('Producto prueba dos', 'Descripcion del producto dos' , 3500,'./public/img/foto1.png', '08urww'); // Producto con falta de información

products.addProduct('Producto prueba cuatro', 'Descripcion del producto cuatro' , 2400,'./public/img/foto1.png', '08uw9', 200); //Producto con mismo codigo


products.getProductById(1);
products.getProductById(4);

