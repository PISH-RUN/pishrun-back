"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event",
      handler: "event.find",
    },
  ],
};
