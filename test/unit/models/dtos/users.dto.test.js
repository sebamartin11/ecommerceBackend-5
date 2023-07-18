const chai = require("chai");
const { CurrentUserDTO } = require("../../../../src/models/dtos/users.dto");

const expect = chai.expect;

describe("[Users DTO Unit Test cases]", async function () {
  this.timeout(5000);
  
  it("User DTO should format user for Current User template successfully", function () {
    const testUser = {
      first_name: "Jhon",
      last_name: "Doe",
      email: "test@email.com",
      password: "super-secret-password",
      role: "user",
    };
    const formattedUser = new CurrentUserDTO(testUser);

    expect(formattedUser).to.not.have.property("first_name");
    expect(formattedUser).to.not.have.property("last_name");
    expect(formattedUser).to.not.have.property("password");

    expect(formattedUser).to.have.property("fullName");
    expect(formattedUser).to.have.property("role");
    expect(formattedUser).to.have.property("email");

    expect(formattedUser.fullName).to.be.equal("Jhon Doe");
  });
});
