const { apiSuccessResponse, HTTP_STATUS } = require("../utils/api.utils");

const sessionsRepository = require("../models/repositories/sessions.repository");

class SessionsController {
  static async register(req, res, next) {
    const { first_name, last_name, age, email, password } = req.body;
    const profile_image = req.file && req.file.filename ? req.file.filename : undefined;

    try {
      await sessionsRepository.register(
        res,
        first_name,
        last_name,
        age,
        email,
        password,
        profile_image
      );
      const response = apiSuccessResponse("User registered successfully!");
      return res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      await sessionsRepository.login(res, email, password);
      const response = apiSuccessResponse("User logued in successfully!");
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async loginGithub(req, res, next) {
    const user = req.user;
    try {
      await sessionsRepository.loginGithub(res, user);
      const response = apiSuccessResponse(
        "User logued in successfully with Github!"
      );
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async logOut(req, res, next) {
    try {
      await sessionsRepository.logOutSession(res, req);
      const response = apiSuccessResponse("Session close");
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async currentSession(req, res, next) {
    try {
      const currentUser = await sessionsRepository.getUserSession(req);
      const response = apiSuccessResponse(currentUser);
      return res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SessionsController;
