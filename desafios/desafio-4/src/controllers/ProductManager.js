const fs = require('fs');

class ProductManager {

    static id = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
        this.readFile();
    }

    readFile() {
        const data = fs.readFileSync(this.path, "utf-8");
        if (data) {
            this.products = JSON.parse(data);
            ProductManager.id = this.products[this.products.length - 1].id;
        };
        return this.products;
    }

    async addProduct(title, description, price, thumbnail = [], code, stock, status = true, category) {
        const product = { title, description, price, thumbnail, code, stock, status, category };
        try {
            if (this.products.find(e => e.code === product.code)) {
                return {status:false, message: `El producto con el código ${product.code} ya existe.`}
            } else if (!product.title || !product.description || !product.price || !product.status || !product.stock || !product.category) {
                return{status:false, message:'Debe llenar todos los datos para ingresar un artículo'}
            } else {
                this.products.push({ ...product, id: ++ProductManager.id });
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
                await this.readFile();
                return{status: true, message: 'PRODUCTO AGREGADO EXITOSAMENTE'};
            }
        } catch (error) {
            return{status:false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}`}
        }   
    }



    getProducts() {
        if(this.products){
            return {status:true,products: this.products}
        } 
        return{status:false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}`}
    }



    getProductById(id) {
        try{
            const productFound = this.products.find(e => e.id === id);
            if (productFound) {
                return {status:true, message:`Producto ${id} encontrado :`, product:productFound};
            }
            else{
                return { status: false, message: `Product Not Found : (${id})` }
            }
        }
        catch{
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
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
               return{status:true, message:`La propiedad ${property} del producto ${id} se ha modificado correctamente.`}
            }
            else {
                return { status: false, message: `Product Not Found : (${id})` }
            }
        }
        catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }


    async deleteProduct(id) {
        try {
            const productFound = this.products.find(e => e.id === id);
            if (productFound) {
                this.products = this.products.filter(object => object !== productFound); //Filtro el array para descartar el producto a eliminar.
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2)) // Piso el antiguo documento y guardo el nuevo array sin el elemento eliminado.
                await this.readFile();
                return { status: true, message: `El producto ${id} se ha eliminado.` };
            }
            else { return { status: false, message: `Product Not Found : (${id})` } }
        }
        catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }
}

module.exports = ProductManager;