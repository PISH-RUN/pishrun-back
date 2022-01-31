module.exports = {
  routes: [
    {
      method: "GET",
      path: "/tasks/:id/discussions",
      handler: "task.discussions",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
