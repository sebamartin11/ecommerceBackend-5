const path = require("path");
const mongoose = require("mongoose");
const chai = require("chai");
const supertest = require("supertest");

const { DB_CONFIG } = require("../../../../src/config/db.config");
const {
  SESSION_KEY,
  API_URL,
  PORT,
} = require("../../../../src/config/env.config");

const {
  ProductsModel,
} = require("../../../../src/models/schemas/products.schema");
const { UsersModel } = require("../../../../src/models/schemas/users.schema");
const { CartsModel } = require("../../../../src/models/schemas/carts.schema");

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

const dropUsers = async () => {
  await UsersModel.collection.drop();
};

const dropCarts = async () => {
  await CartsModel.collection.drop();
};

const dropProducts = async () => {
  await ProductsModel.collection.drop();
};

describe("Integration Test Products routes [Unanthenticated and Unauthorized users]", () => {
  let cookie;

  it("[GET] - [api/products] - should return a code 401 for Unauthenticated users", async () => {
    const response = await requester.get("/api/products");
    expect(response.statusCode).to.be.equal(401);
  });

  it("[POST] - [api/products] - should return a code 403 for Unauthorized users", async () => {
    await dropUsers();
    await dropCarts();

    const mockUser = {
      first_name: "John",
      last_name: "Dho",
      age: 27,
      email: "test@gmail.com",
      password: "password",
      cart: mongoose.Types.ObjectId(),
      role: "user",
    };

    const result = await requester
      .post("/api/sessions/register")
      .send(mockUser);

    expect(result.statusCode).to.be.equal(201);
    expect(result.body.payload).to.be.equal("User registered successfully!");

    // check if cookie was set successfully

    const cookieHeader = result.headers["set-cookie"][0];
    expect(cookieHeader).to.be.ok;

    cookie = {
      name: cookieHeader.split("=")[0],
      value: cookieHeader.split("=")[1],
    };

    expect(cookie.name).to.be.equal(SESSION_KEY);
    expect(cookie.value).to.be.ok;

    const mockProduct = {
      title: "Mock Product",
      description: "a product to make tests",
      code: "abc123",
      price: 10,
      product_image: [],
      stock: 5,
      category: "tests",
      status: true,
    };

    const response = await requester
      .post("/api/products")
      .send(mockProduct)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(response.body.success).to.be.equal(false);
    expect(response.body.description).to.be.equal("Access Denied");
  });
});

describe("Integration Test Products routes [ROLE => 'user']", () => {
  let cookie;

  it("[POST] - [api/sessions/register] - should create a user and a session successfully", async () => {
    await dropUsers();
    await dropCarts();

    const mockUser = {
      first_name: "John",
      last_name: "Dho",
      age: 20,
      email: "test@gmail.com",
      password: "password",
      cart: mongoose.Types.ObjectId(),
      role: "user",
    };

    const response = await requester
      .post("/api/sessions/register")
      .send(mockUser);

    expect(response.statusCode).to.be.equal(201);
    expect(response.body.payload).to.be.equal("User registered successfully!");

    // check if cookie was set successfully

    const cookieHeader = response.headers["set-cookie"][0];
    expect(cookieHeader).to.be.ok;

    cookie = {
      name: cookieHeader.split("=")[0],
      value: cookieHeader.split("=")[1],
    };

    expect(cookie.name).to.be.equal(SESSION_KEY);
    expect(cookie.value).to.be.ok;
  });

  it("[GET] - [api/products] - should get all products sucessfully", async () => {
    const response = await requester
      .get("/api/products")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(response.body.success).to.be.equal(true);
    expect(response.body).to.be.an("object");
    expect(response.body.payload.payload).to.be.an("array");
  });
});

describe("Test Products routes [ROLE => 'admin' or 'premium']", () => {
  let cookie;

  it("[POST] - [api/sessions/register] - should create a user and a session successfully", async () => {
    await dropUsers();

    const mockUser = {
      first_name: "John",
      last_name: "Dho",
      age: 32,
      email: "test@gmail.com",
      password: "password",
      cart: mongoose.Types.ObjectId(),
    };

    const response = await requester
      .post("/api/sessions/register")
      .send(mockUser);

    expect(response.statusCode).to.be.equal(201);
    expect(response.body.payload).to.be.equal("User registered successfully!");

    // check if cookie was set successfully

    const cookieHeader = response.headers["set-cookie"][0];
    expect(cookieHeader).to.be.ok;

    cookie = {
      name: cookieHeader.split("=")[0],
      value: cookieHeader.split("=")[1],
    };

    expect(cookie.name).to.be.equal(SESSION_KEY);
    expect(cookie.value).to.be.ok;
  });

  it("[POST] - [api/products] - should create a product sucessfully", async () => {
    await dropProducts();

    const user = await UsersModel.findOne({ email: "test@gmail.com" }).lean();
    const uid = user._id;
    await UsersModel.updateOne(
      { _id: uid },
      {
        $set: {
          role: "premium",
          update_status: true,
          documents: [
            { name: "test1", reference: "test1", docType: "id_document" },
            { name: "test2", reference: "test2", docType: "proof_of_address" },
            { name: "test3", reference: "test3", docType: "account_status" },
          ],
        },
      }
    );

    const mockLoginCredentials = {
      email: "test@gmail.com",
      password: "password",
    };

    const loginResponse = await requester
      .post("/api/sessions/login")
      .send(mockLoginCredentials);

    const cookieHeader = loginResponse.headers["set-cookie"][0];

    cookie = {
      name: cookieHeader.split("=")[0],
      value: cookieHeader.split("=")[1],
    };
    const mockProduct = {
      title: "Mock Product",
      description: "a product to make tests",
      code: "abc123",
      price: 10,
      stock: 5,
      category: "tests",
      status: true,
    };
  

    const response = await requester
      .post("/api/products")
      .field("title", mockProduct.title)
      .field("description", mockProduct.description)
      .field("code", mockProduct.code)
      .field("price", mockProduct.price)
      .attach(
        "product_image",
        path.resolve(__dirname, "../products/images/placeholder.jpg")
      )
      .field("stock", mockProduct.stock)
      .field("category", mockProduct.category)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(response.statusCode).to.be.equal(201);
    expect(response.body.payload).to.be.ok;
    expect(response.body.payload).to.have.property("_id");
    expect(response.body.payload.product_image).to.be.ok;


  });

  it("[DELETE] - [api/products/:pid] - should delete a product by their id sucessfully", async () => {
    const product = await ProductsModel.findOne({ code: "abc123" }).lean();
    const pid = product._id;

    const response = await requester.delete(`/api/products/${pid}`);
    const deletedProduct = await ProductsModel.findOne({
      code: "abc123",
    }).lean();

    expect(response.statusCode).to.be.equal(200);
    expect(deletedProduct).to.be.equal(null);
  });
});
