class ProductManager {
    constructor() {
        this.products = [];
    }

    generateProductId() {
        const productId = (this.products.length + 1).toString();
        return productId;
    }

    getProducts() {
        return this.products;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            throw new Error("Todos los parámetros son obligatorios.");
        }
        
        const isCodeUnique = this.products.every((product) => product.code !== code);

        if (!isCodeUnique) {
            throw new Error("El código del producto ya está en uso.");
        }

        const productId = this.generateProductId();
        const newProduct = {
            id: productId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        return newProduct;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);

        if (!product) {
            console.error("Not found");
            return null;
        }

        return product;
    }
}

const productManager = new ProductManager();


console.log(productManager.getProducts());


const newProduct = productManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
);
productManager.addProduct(
    "Producto 2",
    "Descripción del producto 2",
    100,
    "Imagen 2",
    "code1",
    10
);

productManager.addProduct(
    "Producto 3",
    "Descripción del producto 3",
    150,
    "Imagen 3",
    "code2",
    20
);
console.log("Producto agregado:", newProduct);
console.log(productManager.getProducts());

try {
    productManager.addProduct(
        "producto prueba",
        "Este es un producto prueba",
        200,
        "Sin imagen",
        "abc123",
        25
    );
} catch (error) {
    console.error("Error al agregar producto duplicado:", error.message);
}


const productIdToFind = '2'; 
const foundProduct = productManager.getProductById(productIdToFind);

if (foundProduct !== null) {
    console.log("Producto encontrado por ID:", foundProduct);
} else {
    console.error("Producto no encontrado");
}
try {
    // Intentar agregar un producto sin todos los parámetros requeridos
    productManager.addProduct(
        "producto prueba",
        "Este es un producto prueba",
        200,
        "Sin imagen",
        "abc123"
        // Faltan stock en este ejemplo
    );
} catch (error) {
    console.error("Error al agregar producto sin todos los parámetros:", error.message);
}