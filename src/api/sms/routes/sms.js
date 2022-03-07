module.exports = {
  routes: [
    {
      method: "POST",
      path: "/admin/sms/send",
      handler: "sms.send",
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
