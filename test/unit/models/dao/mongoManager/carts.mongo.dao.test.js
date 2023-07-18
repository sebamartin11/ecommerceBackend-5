const chai = require("chai");

const {
  CartsModel,
} = require("../../../../../src/models/schemas/carts.schema");
const CartsMongoDao = require("../../../../../src/models/daos/mongoManager/carts.mongo.dao");
const ProductsMongoDao = require("../../../../../src/models/daos/mongoManager/products.mongo.dao");
const expect = chai.expect;

describe("[Carts DAO Unit Test cases]", async function () {
  this.timeout(5000);

  before(function () {
    this.cartsDao = new CartsMongoDao();
    this.productsDao = new ProductsMongoDao();
  });

  beforeEach(async function () {
    await CartsModel.deleteMany();
  });

  after(async function () {
    await CartsModel.deleteMany();
  });

  it("should create a cart when using the 'addCart' method", async function () {
    const result = await this.cartsDao.addCart();
    expect(result).to.be.an("object");
    expect(result).to.have.property("_id");
  });

  it("should return an array of carts when using the 'getCarts' method", async function () {
    const result = await this.cartsDao.getCarts();
    expect(result).to.be.an("array");
  });

  it("should retrieve a cart by their id when using the 'getCartById' method", async function () {
    const testCart = await this.cartsDao.addCart();

    const result = await this.cartsDao.getCartById(testCart._id);
    expect(result).to.have.property("_id");
    expect(result._id.toString()).to.be.equal(testCart._id.toString());
  });

  it("should update a cart successfully when using the 'updateCartProduct' method", async function () {
    const testCart = await this.cartsDao.addCart();

    const testProduct = {
      title: "Test Product",
      description: "Test description",
      code: "test-code-cart1",
      price: 10,
      product_image: "test-thumbnail",
      stock: 5,
      category: "test-category",
      status: true,
      owner: "admin",
    };
    const product = await this.productsDao.addProduct(
      testProduct.title,
      testProduct.description,
      testProduct.code,
      testProduct.price,
      testProduct.product_image,
      testProduct.stock,
      testProduct.category,
      testProduct.status,
      testProduct.owner
    );

    const quantity = 2;

    await this.cartsDao.updateCartProduct(testCart._id, product._id, quantity);

    const updatedCart = await this.cartsDao.getCartById(testCart._id);

    expect(updatedCart.products).to.have.lengthOf(1); // Expect the cart to have one product
    expect(updatedCart.products[0].product._id.toString()).to.be.equal(
      product._id.toString()
    );
    // Compare the product ids
    expect(updatedCart.products[0].amount).to.be.equal(quantity); // Expect the quantity to be correct
  });

  it("should clean a cart successfully when using the 'deleteCart' method", async function () {
    const testCart = await this.cartsDao.addCart();

    await this.cartsDao.deleteCart(testCart._id);

    const deletedCart = await this.cartsDao.getCartById(testCart._id);

    expect(deletedCart.products).to.be.an("array");
    expect(deletedCart.products).to.have.lengthOf(0);
  });

  it("should delete a product from a cart successfully when using the 'deleteProductFromCart' method", async function () {
    const testCart = await this.cartsDao.addCart();
    const testProduct = {
      title: "Test Product",
      description: "Test description",
      code: "test-code-cart2",
      price: 10,
      product_image: "test-thumbnail",
      stock: 5,
      category: "test-category",
      owner: "admin",
    };

    const product = await this.productsDao.addProduct(
      testProduct.title,
      testProduct.description,
      testProduct.code,
      testProduct.price,
      testProduct.product_image,
      testProduct.stock,
      testProduct.category,
      testProduct.owner
    );

    const quantity = 2;

    await this.cartsDao.updateCartProduct(testCart._id, product._id, quantity);
    await this.cartsDao.deleteProductFromCart(testCart._id, product._id);

    const updatedCart = await this.cartsDao.getCartById(testCart._id);

    expect(updatedCart.products).to.have.lengthOf(0);
  });
});
