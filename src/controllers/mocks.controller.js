const { ProductsModel } = require("../models/schemas/products.schema");
const { UsersModel } = require("../models/schemas/users.schema");
const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");
const { generateProduct, generateUser } = require("../utils/mocks.utils");

class MocksController {
  //CREATE mock products
  static async generateMockProducts(req, res, next) {
    const total = +req.query.total || 20;
    try {
      const users = await UsersModel.find({ role: "premium" });
      let result = Array.from({ length: total }, () => generateProduct(users));
      const productToDB = await ProductsModel.insertMany(result);
      const response = apiSuccessResponse(productToDB);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async generateMockUsers(req, res, next) {
    const total = +req.query.total || 10;
    try {
      let result = await Promise.all(
        Array.from({ length: total }, async () => await generateUser())
      );
      const userToDB = await UsersModel.insertMany(result);
      const response = apiSuccessResponse(userToDB);
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MocksController;
