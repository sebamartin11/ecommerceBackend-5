const chai = require("chai");
const bcrypt = require("bcrypt");
const { hashPassword, isValidPassword } = require("../../../src/utils/hash.utils");

const expect = chai.expect;

describe("[Bcrypt Utils Unit Test cases]", async function () {
  this.timeout(5000);
  
  describe("hashPassword", function () {
    it("should hash the password correctly", function () {
      const password = "password123";
      const hashedPassword = hashPassword(password);

      expect(hashedPassword).to.be.a("string");
      expect(bcrypt.compareSync(password, hashedPassword)).to.be.true;
    });
  });

  describe("isValidPassword", function () {
    it("should return true for a valid password", function () {
      const userDB = {
        password: hashPassword("password123"),
      };
      const password = "password123";

      const isValid = isValidPassword(userDB, password);

      expect(isValid).to.be.true;
    });

    it("should return false for an invalid password", function () {
      const userDB = {
        password: hashPassword("password123"),
      };
      const password = "wrongpassword";

      const isValid = isValidPassword(userDB, password);

      expect(isValid).to.be.false;
    });
  });
});
