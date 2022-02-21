"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/admin/participants",
      handler: "admin-participant.all",
    },
    {
      method: "PUT",
      path: "/admin/participants/:id",
      handler: "participant.update",
      config: {
        policies: [],
      },
    },
  ],
};
