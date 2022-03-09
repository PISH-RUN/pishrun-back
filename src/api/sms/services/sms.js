"use strict";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const baseUrl = "https://api.ghasedak.me";
const apiKey = strapi.config.get("ghasedak.api");
const template = strapi.config.get("ghasedak.otp", "pishrun");


const baseUrlAsanak = "https://panel.asanak.com";
const usernameAsanak = "pishrun";
const passwordAsanak = "Pishrun@654";
const sourceAsanak = "982100021";

module.exports = () => ({
  async otp(receptor, token) {
    const params = new URLSearchParams();
    params.append("receptor", receptor);
    params.append("template", template);
    params.append("type", "1");
    params.append("param1", token);

    const url = new URL("v2/verification/send/simple", baseUrl);
    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        apiKey,
      },
      body: params,
    });

    console.log(response);
  },
  async sendSms(receptor, template, param) {
    const params = new URLSearchParams();
    params.append("receptor", receptor);
    params.append("template", template);
    params.append("type", "1");
    params.append(`param1`, param);

    const url = new URL("v2/verification/send/simple", baseUrl);
    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        apiKey,
      },
      body: params,
    });

    console.log(response);
  },

  async sendSmsAsanak(receptor, template) {
    const params = new URLSearchParams();
    params.append("username", usernameAsanak);
    params.append("password", passwordAsanak);
    params.append("source", sourceAsanak);
    params.append(`destination`, receptor);
    params.append(`message`, template);
    
    const url = new URL("webservice/v1rest/sendsms", baseUrlAsanak);
    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        apiKey,
      },
      body: params,
    });

    console.log(response);
  },
});
