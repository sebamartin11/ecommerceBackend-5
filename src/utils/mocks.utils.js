const { faker } = require("@faker-js/faker");
const { hashPassword } = require("./hash.utils");

const { getDAOS } = require("../models/daos/daosFactory");
const { cartsDao } = getDAOS();

faker.locale = "en";

const generateProduct = (users) => {
  const premiumUsers = users.filter((user) => user.role === "premium");
  const premiumUserEmails = premiumUsers.map((user) => user.email);

  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productName(),
    code: faker.random.alphaNumeric(8),
    price: faker.commerce.price(),
    product_image: "placeholder.jpg",
    stock: faker.datatype.number({ min: 0, max: 100 }),
    category: faker.commerce.department(),
    status: faker.datatype.boolean(),
    owner: faker.helpers.arrayElement(["admin", ...premiumUserEmails]),
  };
};

const ages = [];
for (let i = 0; i <= 60; i++) {
  ages.push(i + 14);
}

const hashMockPassword = hashPassword("1234");

const generateUser = async () => {
  const documentNames = ["id_document", "proof_of_address", "account_status"];

  const userDocuments = [
    {
      name: faker.hacker.noun(),
      reference: faker.image.imageUrl(400, 400, "documents", true),
      docType: documentNames[0],
    },
    {
      name: faker.hacker.noun(),
      reference: faker.image.imageUrl(400, 400, "documents", true),
      docType: documentNames[1],
    },
    {
      name: faker.hacker.noun(),
      reference: faker.image.imageUrl(400, 400, "documents", true),
      docType: documentNames[2],
    },
  ];

  const hasAllDocuments = faker.datatype.boolean();

  const role = hasAllDocuments ? "premium" : "user";

  const updateStatus = role === "premium";

  const newCart = await cartsDao.addCart();

  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    age: faker.helpers.arrayElement(ages),
    password: hashMockPassword,
    profile_image: "default.jpg",
    role: role,
    cart: newCart._id,
    documents: hasAllDocuments ? userDocuments : [],
    last_connection: Date.now(),
    update_status: updateStatus,
  };
};

module.exports = { generateProduct, generateUser };
