"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/admin/participants",
      handler: "admin-participant.all",
    },
  ],
};
