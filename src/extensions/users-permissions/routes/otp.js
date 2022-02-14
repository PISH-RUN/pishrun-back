"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/add-user",
      handler: "auth.addUser",
      config: {
        prefix: "",
        middlewares: ["plugin::users-permissions.rateLimit"],
      },
    },
    {
      method: "POST",
      path: "/auth/add-users",
      handler: "auth.addUsers",
      config: {
        prefix: "",
        middlewares: ["plugin::users-permissions.rateLimit"],
      },
    },
    {
      method: "POST",
      path: "/auth/otp",
      handler: "auth.otp",
      config: {
        prefix: "",
        middlewares: ["plugin::users-permissions.rateLimit"],
      },
    },
    {
      method: "POST",
      path: "/auth/login",
      handler: "auth.login",
      config: {
        prefix: "",
        middlewares: ["plugin::users-permissions.rateLimit"],
      },
    },
  ],
};
