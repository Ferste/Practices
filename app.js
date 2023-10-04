const express = require('express');
const app = express();
const ProductManager = require('./index');


const PORT = 8080;

const productManager = new ProductManager();


app.use(express.json());


app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});


app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado.' });
    }
});


app.use((req, res) => {
    res.status(404).json({ error: 'Recurso no encontrado.' });
});


app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
    productManager.loadProductsFromJSON();
});