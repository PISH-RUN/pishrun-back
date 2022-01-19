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
  ],
};
