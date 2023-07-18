const chai = require("chai");

const {
  TicketsModel,
} = require("../../../../../src/models/schemas/tickets.schema");
const TicketsMongoDao = require("../../../../../src/models/daos/mongoManager/tickets.mongo.dao");

const expect = chai.expect;

describe("[Tickets DAO Unit Test cases]", async function () {
  this.timeout(5000);
  
  before(function () {
    this.ticketsDao = new TicketsMongoDao();
  });

  beforeEach(async function () {
    await TicketsModel.deleteMany();
  });

  after(async function () {
    await TicketsModel.deleteMany();
  });

  it("should return an array of tickets when using the 'getTickets' method", async function () {
    const result = await this.ticketsDao.getTickets();
    expect(result).to.be.an("array");
  });

  it("should add a ticket to the database correctly when using the 'createTicket' method", async function () {
    const testOrder = {
      purchaser: "test@gmail.com",
      amount: 5,
      products: [
        {
          product: "6444fe6ab658f326e37f132d",
          amount: 2,
        },
      ],
      purchase_datetime: new Date().toLocaleDateString(),
      code: "123abcd456def"
    };
    const result = await this.ticketsDao.createTicket(testOrder);
    expect(result).to.have.property("_id");
  });

  it("should retrieve a ticket by their id when using the 'getTicketById' method", async function () {
    const testOrder = {
      purchaser: "test@gmail.com",
      amount: 5,
      products: [
        {
          product: "6444fe6ab658f326e37f132d",
          amount: 2,
        },
      ],
      purchase_datetime: new Date().toLocaleDateString(),
      code: "123abcd456def"
    };
    const result = await this.ticketsDao.createTicket(testOrder);
    const ticket = await this.ticketsDao.getTicketById(result._id);
    expect(result).to.have.property("_id");
    expect(ticket.purchaser).to.be.equal(testOrder.purchaser);
  });

  it("should update a ticket successfully when using the 'updateTicket' method", async function () {
    const testOrder = {
      purchaser: "test@gmail.com",
      amount: 5,
      products: [
        {
          product: "6444fe6ab658f326e37f132d",
          amount: 2,
        },
      ],
      purchase_datetime: new Date().toLocaleDateString(),
      code: "123abcd456def"
    };
    const result = await this.ticketsDao.createTicket(testOrder);

    expect(result).to.have.property("_id");

    await this.ticketsDao.updateTicket(result._id, {
      amount: 10,
    });

    const ticket = await this.ticketsDao.getTicketById({ _id: result._id });

    expect(ticket.amount).to.be.equal(10);
  });
});
