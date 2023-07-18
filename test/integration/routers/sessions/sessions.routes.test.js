const mongoose = require("mongoose");
const chai = require("chai");
const supertest = require("supertest");

const { DB_CONFIG } = require("../../../../src/config/db.config");
const {
  SESSION_KEY,
  API_URL,
  PORT,
} = require("../../../../src/config/env.config");

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

describe("Integration tests for [Sessions routes]", () => {
  let cookie;

  it("[POST] - [api/sessions/register] - should create a user and a session successfully", async () => {
    await dropUsers();
    await dropCarts();

    const mockUser = {
      first_name: "John",
      last_name: "Dho",
      age: 29,
      email: "testSessions@gmail.com",
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

  it("[GET] - [api/sessions/current] - should get the current session", async () => {
    const response = await requester
      .get("/api/sessions/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(response.statusCode).to.be.equal(200);
    expect(response.body.payload.email).to.be.equal("testSessions@gmail.com");
  });

  it("[PUT] - [api/users/premium/:uid] - should return an error if the user doesn't have all the required documents", async () => {
    const user = await UsersModel.findOne({
      email: "testSessions@gmail.com",
    }).lean();
    const uid = user._id.toString();

    const response = await requester
      .put(`/api/users/premium/${uid}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(response.statusCode).to.be.equal(400);
    expect(response.body.success).to.be.equal(false);
    expect(response.body.description).to.be.equal(
      "The User has not finished processing their documentation"
    );
  });

  it("[POST] - [api/sessions/login] - should log in the user successfully", async () => {
    const mockLoginCredentials = {
      email: "testSessions@gmail.com",
      password: "password",
    };

    const response = await requester
      .post("/api/sessions/login")
      .send(mockLoginCredentials);

    expect(response.statusCode).to.be.equal(200);
    expect(response.body.payload).to.be.ok;

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

  it("[GET] - [api/sessions/logout] - should delete the cookie session sucessfully", async () => {
    const response = await requester
      .get("/api/sessions/logout")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(response.statusCode).to.be.equal(200);
    expect(response.body.payload).not.to.have.property("Session close");

    await dropUsers();
    await dropCarts();

  });
});
