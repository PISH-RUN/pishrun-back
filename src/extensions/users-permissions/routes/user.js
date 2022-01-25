"use strict";

module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/users/me",
      handler: "user.updateMe",
      config: {
        prefix: "",
      },
    },
  ],
};
