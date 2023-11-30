module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event",
      handler: "event.find",
    },
    {
      method: "GET",
      path: "/eventData/:slug",
      handler: "event.eventData",
    },
    {
      method: "GET",
      path: "/eventStep/:slug",
      handler: "event.eventStep",
    },
    {
      method: "POST",
      path: "/eventStep/:slug",
      handler: "event.eventStepSave",
    },
    {
      method: "POST",
      path: "/event-register/:slug",
      handler: "event.registerRequest",
    },
    {
      method: "GET",
      path: "/admin/event",
      handler: "event.activeEvent",
    },
  ],
};
