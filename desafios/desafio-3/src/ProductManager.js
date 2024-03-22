const fs = require('fs');

class ProductManager {

    static id = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
        this.readFile();
    }

    readFile() {
            const data =  fs.readFileSync(this.path, "utf-8");
            if (data) {
                this.products = JSON.parse(data);
            };
            return this.products;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const product = { title, description, price, thumbnail, code, stock };

        // this.readFile();

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
        await this.readFile();
    }



    getProducts() {
        return this.products;
    }



    getProductById(id) {
            const productFound = this.products.find(e => e.id === id);
            if(productFound){
                console.log(`Producto ${id} encontrado :`)
                return productFound;
            }
            return `ERROR Not Found : ${id}`

    }


    async updateProduct(id, { property, value }) {
        try {
            const i = this.products.findIndex(e => e.id === id);

            //Corroboro que la propiedad que se pasa como parámetro se encuentre y no se me agregue al objeto como una nueva

            const existingProperty = this.products.some(e => e.hasOwnProperty(property));


            // Si existe el indice del id pasado como parámetro, y la propiedad tambien existe y es distinta a id para ésta no se modifique, entonces proceder.

            if (i >= 0 && existingProperty && property != id) {
                this.products[i] = { ...this.products[i], [property]: value }
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
                await this.readFile();
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
            const productFound = this.products.find(e => e.id === id);
            if (productFound) {
                this.products = this.products.filter(object => object !== productFound); //Filtro el array para descartar el producto a eliminar.
                console.log(`El producto ${id} se ha eliminado.`)
                await fs.promises.writeFile(this.path, JSON.stringify(this.products)) // Piso el antiguo documento y guardo el nuevo array sin el elemento eliminado.
                await this.readFile(); 
                return;
            }
            else { console.log(`ERROR Not Found : ${id}`) }
        }
        catch {
            (error => console.log(error))
        }
    }
}

module.exports = ProductManager;