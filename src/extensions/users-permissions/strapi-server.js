const otpController = require("./controllers/otp");
const userController = require("./controllers/user");
const otpRoutes = require("./routes/otp");
const userRoutes = require("./routes/user");

module.exports = (plugin) => {
  plugin.controllers.auth = {
    ...plugin.controllers.auth,
    ...otpController,
  };

  plugin.controllers.user = {
    ...plugin.controllers.user,
    ...userController,
  };

  plugin.routes["content-api"].routes.push(...otpRoutes.routes);
  plugin.routes["content-api"].routes.unshift(...userRoutes.routes);

  console.log(plugin.controllers.user);

  return plugin;
};
