const taskController = require("./controllers/task");
const taskRoutes = require("./routes/task");
const adminTaskController = require("./controllers/adminTask");
const adminTaskRoutes = require("./routes/adminTask");

module.exports = (plugin) => {
  plugin.controllers.task = taskController;

  plugin.controllers.adminTask = adminTaskController;

  plugin.routes["content-api"].routes.push(...taskRoutes);
  plugin.routes["content-api"].routes.push(...adminTaskRoutes);

  return plugin;
};
