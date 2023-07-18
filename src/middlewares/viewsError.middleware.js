const { logger } = require("../logger/logger");
const path = require("path");

const viewsErrorMiddleware = (error, req, res, next) => {
  logger.debug(error);
  res.sendFile(path.resolve(__dirname, "../public/html/failedRequest.html"));
};
module.exports = {
  viewsErrorMiddleware,
};
