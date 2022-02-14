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
    {
      method: "GET",
      path: "/participants",
      handler: "participant.all",
    },
    {
      method: "POST",
      path: "/participant/accept",
      handler: "participant.accept",
    },
    {
      method: "POST",
      path: "/participant/reject",
      handler: "participant.reject",
    },
  ],
};
