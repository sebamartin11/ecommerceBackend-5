const chai = require("chai");

const {
  ProductsModel,
} = require("../../../../../src/models/schemas/products.schema");
const ProductsMongoDao = require("../../../../../src/models/daos/mongoManager/products.mongo.dao");

const expect = chai.expect;

describe("[Products DAO Unit Test cases]", async function () {
  this.timeout(5000);

  before(function () {
    this.productsDao = new ProductsMongoDao();
  });

  beforeEach(async function () {
    await ProductsModel.deleteMany();
  });

  after(async function () {
    await ProductsModel.deleteMany();
  });

  it("should return an array of products when using the 'getProducts' method", async function () {
    const testProduct = {
      title: "Test Product",
      description: "Test description",
      code: "test-code1",
      price: 10,
      product_image: "test-thumbnail",
      stock: 5,
      category: "test-category",
      owner: "admin",
    };

    await this.productsDao.addProduct(
      testProduct.title,
      testProduct.description,
      testProduct.code,
      testProduct.price,
      testProduct.product_image,
      testProduct.stock,
      testProduct.category,
      testProduct.owner
    );

    const result = await this.productsDao.getProducts({});
    expect(result).to.not.be.an.undefined;
    expect(result.docs).to.be.an("array");
    expect(result.totalDocs).to.be.a("number");
    expect(result.limit).to.be.a("number");
    expect(result.page).to.be.a("number");
  });

  it("should retrieve a product by their id when using the 'getProductById' method", async function () {
    const testProduct = {
      title: "Test Product",
      description: "Test description",
      code: "test-code2",
      price: 10,
      product_image: "test-thumbnail",
      stock: 5,
      category: "test-category",
      owner: "admin",
    };
    const result = await this.productsDao.addProduct(
      testProduct.title,
      testProduct.description,
      testProduct.code,
      testProduct.price,
      testProduct.product_image,
      testProduct.stock,
      testProduct.category,
      testProduct.owner
    );
    const product = await this.productsDao.getProductById(result._id);
    expect(result).to.have.property("_id");
    expect(product.title).to.be.equal(result.title);
  });

  it("should retrieve a product by their code when using the 'getProductByCode' method", async function () {
    const testProduct = {
      title: "Test Product",
      description: "Test description",
      code: "test-code3",
      price: 10,
      product_image: "test-thumbnail",
      stock: 5,
      category: "test-category",
      owner: "admin",
    };
    const result = await this.productsDao.addProduct(
      testProduct.title,
      testProduct.description,
      testProduct.code,
      testProduct.price,
      testProduct.product_image,
      testProduct.stock,
      testProduct.category,
      testProduct.owner
    );
    const product = await this.productsDao.getProductByCode(result.code);
    expect(result).to.have.property("_id");
    expect(product.title).to.be.equal(result.title);
  });

  it("should update a product successfully when using the 'updateProduct' method", async function () {
    const testProduct = {
      title: "Test Product",
      description: "Test description",
      code: "test-code3",
      price: 10,
      product_image: "test-thumbnail",
      stock: 5,
      category: "test-category",
      owner: "admin",
    };
    const result = await this.productsDao.addProduct(
      testProduct.title,
      testProduct.description,
      testProduct.code,
      testProduct.price,
      testProduct.product_image,
      testProduct.stock,
      testProduct.category,
      testProduct.owner
    );
    expect(result).to.have.property("_id");
    expect(result.title).to.be.equal("Test Product");

    await this.productsDao.updateProduct(result._id, {
      title: "Updated Product",
      description: "Updated description",
    });

    const updatedProduct = await this.productsDao.getProductById(result._id);

    expect(updatedProduct.title).to.be.equal("Updated Product");
    expect(updatedProduct.description).to.be.equal("Updated description");
  });

  it("should delete a product successfully when using the 'deleteProduct' method", async function () {
    const testProduct = {
      title: "Test Product",
      description: "Test description",
      code: "test-code4",
      price: 10,
      product_image: "test-thumbnail",
      stock: 5,
      category: "test-category",
      owner: "admin",
    };
    const result = await this.productsDao.addProduct(
      testProduct.title,
      testProduct.description,
      testProduct.code,
      testProduct.price,
      testProduct.product_image,
      testProduct.stock,
      testProduct.category,
      testProduct.owner
    );
    expect(result).to.have.property("_id");

    await this.productsDao.deleteProduct(result._id);

    const deletedProduct = await this.productsDao.getProductById(result._id);

    expect(deletedProduct).to.be.equal(null);
  });
});
