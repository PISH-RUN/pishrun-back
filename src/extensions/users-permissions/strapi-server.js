const otpController = require("./controllers/otp");
const otpRoutes = require("./routes/otp");

module.exports = (plugin) => {
  plugin.controllers["auth"] = {
    ...plugin.controllers["auth"],
    ...otpController,
  };

  plugin.routes["content-api"].routes.push(...otpRoutes.routes);

  return plugin;
};
