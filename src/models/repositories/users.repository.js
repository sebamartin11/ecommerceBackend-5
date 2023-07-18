const { HttpError, HTTP_STATUS } = require("../../utils/api.utils");
const { SECRET_KEY } = require("../../config/env.config");
const jwt = require("jsonwebtoken");
const { hashPassword, isValidPassword } = require("../../utils/hash.utils");
const { getDAOS } = require("../daos/daosFactory");
const { getServices } = require("../../services/app.service");

const { usersDao, cartsDao } = getDAOS();
const { messagesService } = getServices();

class UsersRepository {
  async getUsers() {
    const users = await usersDao.getUsers();
    return users;
  }

  async getUserById(uid) {
    if (!uid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Must provide a valid ID");
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    return user;
  }

  async getUserByEmail(email) {
    if (!email) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing param");
    }
    const user = await usersDao.getUserByEmail(email);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    return user;
  }

  async createUser(payload, profile_image) {
    const { first_name, last_name, age, email, password } = payload;
    if (!first_name || !last_name || !age || !email || !password) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing fields");
    }
    const user = await usersDao.getUserByEmail(email);
    if (user) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "User already exist");
    }

    const cartForNewUser = await cartsDao.addCart();

    const newUserPayload = {
      first_name,
      last_name,
      age,
      email,
      password: hashPassword(password),
      profile_image,
      cart: cartForNewUser._id,
      role: "user",
    };

    const newUser = await usersDao.createUser(newUserPayload);
    return newUser;
  }

  async addDocuments(uid, files) {
    if (!uid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Must provide a valid ID");
    }

    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    if (!files) {
      throw new HttpError("Missing documents", HTTP_STATUS.BAD_REQUEST);
    }

    const uploadedDocuments = Object.values(files).map((file) => ({
      name: file[0].originalname,
      reference: file[0].path,
      docType: file[0].fieldname,
    }));

    const userPayload = {
      documents: uploadedDocuments,
    };

    const requiredDocuments = [
      "id_document",
      "proof_of_address",
      "account_status",
    ];

    const hasRequiredDocuments = requiredDocuments.every((document) => {
      return user.documents.some((d) => d.docType === document);
    });

    if (hasRequiredDocuments) {
      userPayload.update_status = true;
    }

    const updatedUser = await usersDao.updateUserById(uid, userPayload);
    return updatedUser;
  }

  async updateUser(uid, payload) {
    if (!uid || !Object.keys(payload).length) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Missing data from user");
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const updatedUser = await usersDao.updateUserById(uid, payload);
    return updatedUser;
  }

  async isResetPasswordTokenExpired(token) {
    const payloadToken = jwt.verify(token, SECRET_KEY);
    const tokenExpiration = payloadToken.exp;
    const now = Math.floor(Date.now() / 1000);

    const isTokenExpired = now > tokenExpiration ? true : false;

    return isTokenExpired;
  }

  async resetPasswordEmail(req) {
    const sendResetPasswordEmail = await messagesService.resetPasswordEmail(
      req
    );
    return sendResetPasswordEmail;
  }

  async setNewPassword(password, token) {
    const payloadToken = jwt.verify(token, SECRET_KEY);
    const email = payloadToken.email;

    if (!email || !payloadToken) {
      throw new HttpError(HTTP_STATUS.INVALID_TOKEN, "Invalid token");
    }

    const user = await usersDao.getUserByEmail(email);

    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    if (isValidPassword(user, password)) {
      throw new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        "New password cannot be the same as the old one"
      );
    }

    const hashNewPassword = hashPassword(password);

    const updatedUser = await usersDao.updateUserByEmail(email, {
      password: hashNewPassword,
    });
    return updatedUser;
  }

  async updateUserRole(uid) {
    if (!uid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Must provide a valid ID");
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    const requiredDocuments = [
      "id_document",
      "proof_of_address",
      "account_status",
    ];
    const hasRequiredDocuments = requiredDocuments.every((document) => {
      return user.documents.some((d) => d.docType === document);
    });

    if (user.role === "user" && !hasRequiredDocuments && !user.update_status) {
      throw new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        "The User has not finished processing their documentation"
      );
    }

    let newRole;
    if (user.role === "user" && hasRequiredDocuments && user.update_status) {
      newRole = "premium";
    }

    const updatedUser = await usersDao.updateUserById(uid, { role: newRole });
    return updatedUser;
  }

  async deleteUser(uid) {
    if (!uid) {
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Must provide a valid ID");
    }
    const user = await usersDao.getUserById(uid);
    if (!user) {
      throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
    }
    const deletedUser = await usersDao.deleteUser(uid);
    return deletedUser;
  }

  async deleteAllInactiveUsers() {
    const currentDate = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(currentDate.getDate() - 2);

    const deleteFilter = {
      last_connection: { $lt: twoDaysAgo },
      role: { $ne: "admin" }, // Exclude users with role "admin"
    };

    // Get all users
    const allUsers = await usersDao.getUsers();

    // Filter inactive users
    const inactiveUsers = allUsers.filter(
      (user) => user.last_connection < twoDaysAgo && user.role !== "admin"
    );

    // Send notification email to inactive users

    await Promise.all(
      inactiveUsers.map(async (user) => {
        await messagesService.deletionNotificationEmail(user);
      })
    );

    // Wait for 1 hour before deleting users
    await new Promise((resolve) => setTimeout(resolve, 3600000));

    // Delete inactive users
    const deletedUsers = await usersDao.deleteUsers(deleteFilter);

    return deletedUsers;
  }
}

module.exports = new UsersRepository();
