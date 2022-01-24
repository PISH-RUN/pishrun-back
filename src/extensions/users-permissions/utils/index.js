"use strict";

const getService = (name) => {
  return strapi.plugin("users-permissions").service(name);
};

const smsService = () => {
  return strapi.service("api::sms.sms");
};

module.exports = {
  getService,
  smsService,
};
