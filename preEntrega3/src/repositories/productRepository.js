const ProductModel = require('../models/products.model.js');

class ProductRepository {
    async addProduct(title, description, price, thumbnail = [], code, stock, status = true, img = "", category) {
        const product = { title, description, price, thumbnail, code, stock, status, img, category };
        const existingProduct = await ProductModel.findOne({ code: code });
        try {
            if (existingProduct) {
                return { status: false, message: `El producto con el código ${product.code} ya existe.` }

            } else if (!product.title || !product.description || !product.price || !product.stock || !product.category) {
                return { status: false, message: 'Debe llenar todos los datos para ingresar un artículo' }

            } else {
                const newProduct = ProductModel({ ...product })
                await newProduct.save();
                return { status: true, message: 'PRODUCTO AGREGADO EXITOSAMENTE' };
            }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }

    async getProducts({ page, limit, query, sort }) {
        try {
            let products;
            sort > 0 ? 1 : -1 //Ascendente o Descendente s/ numeración.
            if (query) {
                products = await ProductModel.paginate({ category: { $eq: query } }, { limit, page, sort: { price: sort } })
                return products ;
            }
            else{
                products = await ProductModel.paginate({}, { limit, page, sort: { price: sort } })
                return products ;
            }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` };
        }
    }

    async getProductById(id) {
        try {
            const productFound = await ProductModel.findById(id);
            if (productFound) {
                return { status: true, message: `Producto ${id} encontrado :`, product: productFound };
            }
            else {
                return { status: false, message: `Product Not Found : (${id})` }
            }
        }
        catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }

    async updateProduct(id, { property, value }) {
        try {
            const product = await ProductModel.findOne({ _id: id });
            if (product) {
                //Corroboro que la propiedad que se pasa como parámetro se encuentre y no se me agregue al objeto como una nueva
                if (property in product) {
                    product[property] = value;
                    await product.save();
                    return { status: true, message: `La propiedad ${property} del producto ${id} se ha modificado correctamente.` };
                } else {
                    return { status: false, message: `La propiedad ${property} no existe en el producto ${id}. No se ha modificado.` };
                }
            } else {
                return { status: false, message: `Product Not Found : (${id})` }
            }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` };
        }
    }

    async deleteProduct(id) {
        try {
            const productToDelete = await ProductModel.findByIdAndDelete(id)
            if (productToDelete) {
                return { status: true, message: `El producto ${id} se ha eliminado.` };
            }
            else { return { status: false, message: `Product Not Found : (${id})` } }
        }
        catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` } 
        }
    }
}

module.exports = ProductRepository;