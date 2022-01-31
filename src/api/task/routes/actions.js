module.exports = {
  routes: [
    {
      method: "GET",
      path: "/tasks/:id/start",
      handler: "task.start",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/tasks/:id/finish",
      handler: "task.finish",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/tasks/:id/suspend",
      handler: "task.suspend",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/tasks/:id/unsuspend",
      handler: "task.unsuspend",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/tasks/:id/fail",
      handler: "task.fail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
