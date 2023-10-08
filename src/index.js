const path = require('path');
const fs = require('fs');
// const uuid = require('uuid');

class ProductManager {
    constructor(dire) {
        this.products = [];
        this.path = dire;
    }

    async loadProductsFromJSON() {
        try {
            const absolutePath = path.resolve(this.path); 

            if (!fs.existsSync(absolutePath)) {
                fs.writeFileSync(absolutePath, '[]', 'utf8');
                console.log(`Archivo JSON '${this.path}' creado.`); 
            }

            const data = fs.readFileSync(absolutePath, 'utf8');
            this.products = JSON.parse(data);
            console.log('Productos cargados con éxito desde el archivo JSON.');
        } catch (error) {
            console.error('Error al cargar productos desde el archivo JSON:', error);
        }
    }

    addProduct(newProduct) {
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        const missingFields = requiredFields.filter(field => !newProduct.hasOwnProperty(field));

        if (missingFields.length > 0) {
            console.error(`El producto no puede ser agregado. Faltan los siguientes campos: ${missingFields.join(', ')}`);
            return;
        }

        const existingProduct = this.products.find(product => product.code === newProduct.code);
        if (existingProduct) {
            console.error(`Ya existe un producto con el codigo '${newProduct.code}'.`);
            return;
        }

        
        newProduct.id = this.products.length + 1;
        // newProduct.id = uuid.v4(); 

        this.products.push(newProduct);
        console.log('Producto agregado con exito.');

        this.saveProductsToJSON();
    }

    saveProductsToJSON() {
        try {
            const absolutePath = path.resolve(this.jsonFilePath);
            const jsonData = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(absolutePath, jsonData, 'utf8');
            console.log('Productos guardados con exito en el archivo JSON.');
        } catch (error) {
            console.error('Error al guardar productos en el archivo JSON:', error);
        }
    }

    getProducts(limit) {
        this.loadProductsFromJSON();
        
        if (limit !== undefined) {
            return this.products.slice(0, limit);
        }

        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error(`No se encontro ningun producto con el ID ${id}.`);
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const productToUpdate = this.getProductById(id);
    
        if (updatedFields.hasOwnProperty('id')) {
            console.error('El campo "id" no puede ser modificado.');
            return;
        }
    
        const allowedFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    
        for (const field in updatedFields) {
            if (updatedFields.hasOwnProperty(field) && allowedFields.includes(field)) {
                productToUpdate[field] = updatedFields[field];
            } else {
                console.error(`El campo "${field}" no es un campo válido para actualizar.`);
            }
        }
    
        console.log('Producto actualizado con exito.');
    
        this.saveProductsToJSON();
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            console.error(`No se encontro ningun producto con el ID ${id}.`);
            return;
        }

        this.products.splice(index, 1);
        console.log('Producto eliminado con exito.');

        this.saveProductsToJSON();
    }
}

const productManager = new ProductManager('../products.json');
productManager.loadProductsFromJSON();

// const newProduct = {
//     title: 'producto prueba',
//     description: 'Este es un producto prueba',
//     price: 200,
//     thumbnail: 'Sin imagen',
//     code: 'abc123',
//     stock: 25
// };

// productManager.addProduct(newProduct);

console.log(productManager.getProducts());

// const productIdToUpdate = 1;
// const updatedFields = {
//     price: 200,
//     description: 'Descripción actualizada',
//     banana : 'banana'
// };

// productManager.updateProduct(productIdToUpdate, updatedFields);

// const productIdToDelete = 3;
// productManager.deleteProduct(productIdToDelete);

console.log(productManager.getProducts());

module.exports = ProductManager;