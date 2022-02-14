module.exports = {
  routes: [
    {
      method: "GET",
      path: "/admin/tasks",
      handler: "task.adminTasks",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
