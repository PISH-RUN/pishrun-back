module.exports = {
  routes: [
    {
      method: "POST",
      path: "/tasks/:id/start",
      handler: "task.start",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/tasks/:id/take",
      handler: "task.take",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/tasks/bySlug/:slug",
      handler: "task.bySlug",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/tasks/:id/reject",
      handler: "task.reject",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/tasks/:id/finish",
      handler: "task.finish",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/tasks/:id/suspend",
      handler: "task.suspend",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/tasks/:id/unsuspend",
      handler: "task.unsuspend",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/tasks/:id/fail",
      handler: "task.fail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/tasks/:id/upload",
      handler: "task.file",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
