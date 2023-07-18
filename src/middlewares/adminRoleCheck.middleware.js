const { apiErrorResponse, HTTP_STATUS } = require("../utils/api.utils");

const adminRoleCheck = async (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  } else {
    const response = apiErrorResponse("Access denied");
    return res.status(HTTP_STATUS.FORBIDDEN).json(response);
  }
};

module.exports = {
  adminRoleCheck,
};
