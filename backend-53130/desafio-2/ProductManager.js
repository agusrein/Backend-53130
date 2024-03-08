const fs = require('fs');

class ProductManager {

    static id = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const product = { title, description, price, thumbnail, code, stock };

        const data = await fs.promises.readFile(this.path,"utf-8");
        if(data){this.products = JSON.parse(data)};

            if (this.products.find(e => e.code === product.code)) {
                console.log(`ERROR el producto con el codigo ${product.code}, ya existe.`)
                return;
            }
            else if (!product.title || !product.description || !product.price || !product.thumbnail || !product.stock) {
                console.log('ERROR debe llenar todos los datos para ingresar un artículo');
                return;
            }

            else this.products.push({ ...product, id: ++ProductManager.id });
    
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
 
    }



    getProducts() {
        const data = fs.readFileSync(this.path,"utf-8");
        data ? this.products = JSON.parse(data) : this.products;
        return this.products;
    }



    async getProductById(id) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data)
            const productFound = this.products.find(e => e.id === id);
            productFound ? console.log(`Producto ${id} encontrado :`, productFound) : console.log(`ERROR Not Found : ${id}`);
        }
        catch {
            (error => console.log(error))
        }
    }


    async updateProduct(id, { property, value }) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data)
            const i = this.products.findIndex(e => e.id === id);

            //Corroboro que la propiedad que se pasa como parámetro se encuentre y no se me agregue al objeto como una nueva

            const existingProperty = this.products.some(e => e.hasOwnProperty(property));
            
            
            // Si existe el indice del id pasado como parámetro, y la propiedad tambien existe y es distinta a id para ésta no se modifique, entonces proceder.

            if (i >= 0 && existingProperty && property != id) {
                this.products[i] = { ...this.products[i], [property]: value }
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
                console.log(`La propiedad ${property} del producto ${id} se ha modificado correctamente.`)
            }
            else { console.log(`ERROR Not Found : ${id}`) }
        }
        catch {
            (error => console.log(error))
        }

    }


    async deleteProduct(id) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data)
            const productFound = this.products.find(e => e.id === id);
            if (productFound) {
                this.products = this.products.filter(object => object !== productFound); //Filtro el array para descartar el producto a eliminar.
                console.log(`El producto ${id} se ha eliminado.`)
                return await fs.promises.writeFile(this.path, JSON.stringify(this.products)) // Piso el antiguo documento y guardo el nuevo array sin el elemento eliminado.
            }
            else { console.log(`ERROR Not Found : ${id}`) }
        }
        catch {
            (error => console.log(error))
        }
    }
}

//TESTING

//1)
// const products = new ProductManager('./products.json');

// //2)
// console.log(products.getProducts());

// //3) 
// products.addProduct('producto prueba', 'Este es un producto prueba',200, 'sin imagen', 'abc123',25);
// products.addProduct('producto prueba', 'Este es un producto prueba',200, 'sin imagen', 'abc234',25);
// products.addProduct('producto prueba', 'Este es un producto prueba',200, 'abc123',25);

// //4)
// console.log(products.getProducts());

// //5)
// products.getProductById(1);
// products.getProductById(5);

//6)
// products.updateProduct(2,{property:'code',value:'codigocambiado'});

//7)
// products.deleteProduct(2);
// products.deleteProduct(5);