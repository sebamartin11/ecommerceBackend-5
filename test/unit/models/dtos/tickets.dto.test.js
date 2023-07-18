const chai = require("chai");
const { TicketDTO } = require("../../../../src/models/dtos/tickets.dto");

const expect = chai.expect;

describe("[Ticket DTO Unit Test cases]", async function () {
  this.timeout(5000);
  
  it("Ticket DTO should format the purchase order successfully", function () {
    const testOrder = {
      purchaser: "test@gmail.com",
      amount: 5,
      products: [
        {
          product: "6444fe6ab658f326e37f132d",
          amount: 2,
        },
      ],
    };
    const formattedOrder = new TicketDTO(
      testOrder.purchaser,
      testOrder.amount,
      testOrder.products
    );

    expect(formattedOrder).to.have.property("products");
    expect(formattedOrder).to.have.property("purchase_datetime");
    expect(formattedOrder).to.have.property("code");
    expect(formattedOrder.products).to.deep.equal(testOrder.products);
  });
});
