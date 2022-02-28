module.exports = {
  routes: [
    {
      method: "GET",
      path: "/stats",
      handler: "stat.stats",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/admin/stats",
      handler: "stat.adminStats",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
