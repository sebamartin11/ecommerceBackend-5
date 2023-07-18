const { BaseRouter } = require("../base.router");
const uploader = require("../../utils/multer.utils");
const UsersController = require("../../controllers/users.controller");

class UsersRoutes extends BaseRouter {
  init() {
    this.get("/", ["admin"], UsersController.getUsers);
    this.post(
      "/",
      ["user", "admin", "premium"],
      uploader.single("profile_image"),
      UsersController.createUser
    );
    this.delete("/", ["admin"], UsersController.deleteAllInactiveUsers);
    this.get(
      "/:uid",
      ["user", "admin", "premium"],
      UsersController.getUserById
    );
    this.put("/:uid", ["admin"], UsersController.updateUser);
    this.delete("/:uid", ["admin"], UsersController.deleteUser);
    this.post(
      "/:uid/documents",
      ["user", "admin"],
      uploader.fields([
        { name: "id_document", maxCount: 1 },
        { name: "proof_of_address", maxCount: 1 },
        { name: "account_status", maxCount: 1 },
      ]),
      UsersController.addDocumentation
    );
    this.put("/premium/:uid", ["user", "admin"], UsersController.changeRole);
    this.post("/resetPassword", ["PUBLIC"], UsersController.resetPasswordEmail);
    this.post("/createNewPassword", ["PUBLIC"], UsersController.setNewPassword);
  }
}

module.exports = new UsersRoutes();
