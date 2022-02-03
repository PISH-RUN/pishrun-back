module.exports = {
  routes: [
    {
      method: "GET",
      path: "/tasks/:id/participant",
      handler: "task.participant",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
