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
    },
    {
      method: "POST",
      path: "/admin/sms/asanak",
      handler: "sms.sendAsanak",
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
