const participantController = require("./controllers/participant");
const participantRoutes = require("./routes/participant");
const adminParticipantController = require("./controllers/adminParticipant");
const adminParticipantRoutes = require("./routes/adminParticipant");

module.exports = (plugin) => {
  plugin.controllers.participant = {
    ...participantController,
  };

  plugin.controllers.adminParticipant = {
    ...adminParticipantController,
  };

  plugin.routes["content-api"].routes.push(...participantRoutes);
  plugin.routes["content-api"].routes.push(...adminParticipantRoutes);

  return plugin;
};
