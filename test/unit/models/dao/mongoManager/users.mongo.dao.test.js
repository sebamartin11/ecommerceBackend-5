const chai = require("chai");
const mongoose = require("mongoose");

const { UsersModel } = require("../../../../../src/models/schemas/users.schema");
const UsersMongoDao = require("../../../../../src/models/daos/mongoManager/users.mongo.dao");

const expect = chai.expect;

describe("[Users DAO Unit Test cases]", async function () {
  this.timeout(5000);

  before(function () {
    this.usersDao = new UsersMongoDao();
  });

  beforeEach(async function () {
    await UsersModel.deleteMany();
  });

  after(async function () {
    await UsersModel.deleteMany();
  });
  

  it("should return an array of users when using the 'getUsers' method", async function () {
    const result = await this.usersDao.getUsers();
    expect(result).to.be.an("array");
  });

  it("should add a user to the database correctly when using the 'createUser' method", async function () {
    const testUser = {
      first_name: "Jhon",
      last_name: "Doe",
      email: "test@email.com",
      password: "super-secret-password",
    };
    const result = await this.usersDao.createUser(testUser);
    expect(result).to.have.property("_id");
    expect(result.first_name).to.be.equal(testUser.first_name);
  });

  it("should add a user to the database correctly and assign a cart reference and a role when using the 'createUser' method", async function () {
    const testUser = {
      first_name: "Jhon",
      last_name: "Doe",
      email: "test@email.com",
      password: "super-secret-password",
      cart: mongoose.Types.ObjectId(),
    };
    const result = await this.usersDao.createUser(testUser);
    expect(result.cart).to.have.property("_id");

    //Check if the role parameter was added by default. users schema.
    expect(result).to.have.property("role");
  });

  it("should retrieve a user by their email when using the 'getUserByEmail' method", async function () {
    const testUser = {
      first_name: "Jhon",
      last_name: "Doe",
      email: "test@email.com",
      password: "super-secret-password",
    };
    const result = await this.usersDao.createUser(testUser);
    const user = await this.usersDao.getUserByEmail(result.email);
    expect(result).to.have.property("_id");
    expect(user.email).to.be.equal(result.email);
  });

  it("should update a user successfully when using the 'updateUserById' method", async function () {
    const testUser = {
      first_name: "Jhon",
      last_name: "Doe",
      email: "test@email.com",
      password: "super-secret-password",
    };
    const result = await this.usersDao.createUser(testUser);
    expect(result).to.have.property("_id");
    expect(result.first_name).to.be.equal("Jhon");
    expect(result.last_name).to.be.equal("Doe");

    await this.usersDao.updateUserById(result._id, {
      first_name: "Pepe",
      last_name: "Nero",
    });

    const user = await this.usersDao.getUserById({ _id: result._id });

    expect(user.first_name).to.be.equal("Pepe");
    expect(user.last_name).to.be.equal("Nero");
  });

  it("should delete a user successfully when using the 'deleteUser' method", async function () {
    const testUser = {
      first_name: "Jhon",
      last_name: "Doe",
      email: "test@email.com",
      password: "super-secret-password",
    };
    const result = await this.usersDao.createUser(testUser);
    expect(result).to.have.property("_id");

    await this.usersDao.deleteUser(result._id);

    const user = await this.usersDao.getUserById({ _id: result._id });

    expect(user).to.be.equal(null);
  });

 
});
