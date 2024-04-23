const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async readProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf-8");
        if (products) {
          const productsJs = JSON.parse(products);
          this.products = productsJs;
        } else {
          this.products = [];
        }
        return this.products;
      } else {
        this.products = [];
        return this.products;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    if (this.products.length === 0) {
      return "List empty";
    }
    return this.products;
  }

  async writeProducts(newProduct) {
    try {
      this.products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    this.getProducts();
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return "Error: All fields are required";
    }

    const existingProduct = this.products.find(
      (product) => product.code === code
    );
    if (existingProduct) {
      return "Error: The product has already been added";
    }

    const newProduct = {
      id: this.getId() + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    await this.writeProducts(newProduct);
  }

  getId() {
    let maxId = 0;
    this.products.map((prod) => {
      if (prod.id > maxId) {
        maxId = prod.id;
      }
      return maxId;
    });
    return maxId;
  }

  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      return "Not found";
    }
    return product;
  }

  async updateProduct(id, field, value) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      return "Product not found";
    }
    product[field] = value;
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    return product;
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return "Product not found";
    }
    const deletedProduct = this.products.splice(index, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    return deletedProduct[0];
  }
}

// Caso de uso para probar los métodos

const products = new ProductManager("./products.json");

const test = async () => {
  try {
    // Se consulta lista de productos
    console.log(await products.getProducts());

    // Se agregan productos
    await products.addProduct(
      "Silla",
      "Silla de madera",
      12345,
      "../img1.jpg",
      "prod1",
      6
    );

    await products.addProduct(
      "Mesa",
      "Mesa de madera",
      67890,
      "../img2.jpg",
      "prod2",
      3
    );

    await products.addProduct(
      "Sillon",
      "Sofa esquinero",
      45632,
      "../img3.jpg",
      "prod3",
      2
    );

    // Se consulta lista de productos
    console.log(await products.getProducts());

    // Se consultan productos especificos
    console.log(await products.getProductById(1));
    console.log(await products.getProductById(6));

    // Se modifica producto
    const updatedProduct = await products.updateProduct(
      1,
      "description",
      "Silla de metal"
    );
    console.log(updatedProduct);

    // Se borra producto y se muestra producto borrado
    const deletedProduct = await products.deleteProduct(3);
    console.log(deletedProduct);

    // Se prueba agrega producto repetido
    console.log(
      await products.addProduct(
        "Mesa",
        "Mesa de madera",
        67890,
        "../img2.jpg",
        "prod2",
        3
      )
    );

    // Se agregan nuevos productos para verificar id automatico
    await products.addProduct(
      "Cama",
      "Sommier",
      74125,
      "../img4.jpg",
      "prod4",
      4
    );

    // Se consulta lista de productos
    console.log(await products.getProducts());
  } catch (error) {
    console.error(error.message);
  }
};

test();