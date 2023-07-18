const mongoose = require("mongoose");
const chai = require("chai");
const supertest = require("supertest");

const { DB_CONFIG } = require("../../../../src/config/db.config");
const {
  SESSION_KEY,
  API_URL,
  PORT,
} = require("../../../../src/config/env.config");

const { CartsModel } = require("../../../../src/models/schemas/carts.schema");
const {
  ProductsModel,
} = require("../../../../src/models/schemas/products.schema");
const { UsersModel } = require("../../../../src/models/schemas/users.schema");

const expect = chai.expect;
const requester = supertest(`http://${API_URL}${PORT}`);

before(function () {
  this.timeout(10000);
  mongoose.set("strictQuery", true);
  mongoose.connect(DB_CONFIG.mongoDb.uri);
});

after(() => {
  mongoose.connection.close();
});

const dropCarts = async () => {
  await CartsModel.collection.drop();
};

const dropProducts = async () => {
  await ProductsModel.collection.drop();
};

const dropUsers = async () => {
  await UsersModel.collection.drop();
};

describe("Integration tests for [Carts routes]", () => {

  it("[POST] - [api/sessions/register] - should create a user 'admin' and a session successfully", async () => {
    const mockUser = {
      first_name: "Kevin",
      last_name: "Dho",
      age: 50,
      email: "test123@gmail.com",
      password: "password",
      role: "admin",
    };

    const response = await requester
      .post("/api/sessions/register")
      .send(mockUser);

    expect(response.statusCode).to.be.equal(201);
    expect(response.body.payload).to.be.ok;
    expect(response.request._data.role).to.be.equal(mockUser.role);
  });

  it("[POST] - [api/carts] - should create a cart sucessfully", async () => {
    const response = await requester.post("/api/carts");

    expect(response.statusCode).to.be.equal(201);
    expect(response.body.payload).deep.equal([]);
    expect(response.body.payload._id).to.be.ok;
  });

  it("[GET] - [api/carts] - should get all carts sucessfully", async () => {
    const response = await requester.get("/api/carts");
    expect(response.statusCode).to.be.equal(200);
    expect(response.body).to.be.an("array");
    response.forEach((cart) => {
      expect(cart).to.be.an("object");
      expect(cart).to.have.property("_id");
    });
  });

  it("[POST] - [api/sessions/register] - should create a user 'premium' and a session successfully", async () => {
    const mockUser = {
      first_name: "David",
      last_name: "Chao",
      age: 47,
      email: "testUser@gmail.com",
      password: "password",
      cart: mongoose.Types.ObjectId(),
      role: "premium",
    };

    const response = await requester
      .post("/api/sessions/register")
      .send(mockUser);

    expect(response.statusCode).to.be.equal(201);
    expect(response.body.payload).to.be.ok;
    expect(response.body.payload.role).to.be.equal(mockUser.role);
  });

  it("[POST] - [api/carts/products/:pid] - Should return 403 avoiding 'premium' users to add their own products'", async () => {
    const createCartResponse = await requester.post("/api/carts");
    const cartId = createCartResponse.body.payload._id;
    expect(createCartResponse.statusCode).to.be.equal(201);

    const mockProduct = {
      title: "Test Product",
      description: "Test description",
      price: 10,
      product_image: "test-thumbnail",
      stock: 5,
      category: "test-category",
      owner: "testUser@gmail.com",
    };
    const createProductResponse = await requester
      .post("/api/products")
      .field("title", mockProduct.title)
      .field("description", mockProduct.description)
      .field("code", mockProduct.code)
      .field("price", mockProduct.price)
      .attach("product_image", ".test/integration/products/images/example.jpg")
      .field("stock", mockProduct.stock)
      .field("category", mockProduct.category)
      .field("status", mockProduct.status)
      .field("owner", mockProduct.owner);
    const productId = createProductResponse.body.payload._id;

    expect(createProductResponse.statusCode).to.be.equal(201);

    const addProductResponse = await requester.post(
      `/api/carts/products/${productId}`
    );

    expect(addProductResponse.statusCode).to.be.equal(403);
    expect(addProductResponse.body.description).to.be.equal(
      "Can not add own products"
    );
  });
});
