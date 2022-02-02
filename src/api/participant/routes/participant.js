"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/participant",
      handler: "participant.find",
    },
    {
      method: "POST",
      path: "/participant/enter",
      handler: "participant.enter",
    },
    {
      method: "POST",
      path: "/participant/add",
      handler: "participant.add",
    },
  ],
};
