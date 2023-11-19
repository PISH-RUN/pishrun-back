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
    {
      method: "POST",
      path: "/users/me/avatar",
      handler: "user.avatar",
      config: {
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/admin/me",
      handler: "user.adminMe",
      config: {
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/admin/users",
      handler: "user.adminUsers",
      config: {
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/admin/users",
      handler: "user.adminAddUser",
      config: {
        prefix: "",
      },
    },
    {
      method: "PUT",
      path: "/admin/users",
      handler: "user.adminEditUsers",
      config: {
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/admin/participants",
      handler: "user.adminCreateParticipants",
      config: {
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/admin/users/:id",
      handler: "user.findOne",
      config: {
        prefix: "",
      },
    },
    {
      method: "PUT",
      path: "/admin/users/:id",
      handler: "user.adminUpdateUser",
      config: {
        prefix: "",
      },
    },
    {
      method: "DELETE",
      path: "/admin/users/:id",
      handler: "user.destroy",
      config: {
        prefix: "",
      },
    },
  ],
};
