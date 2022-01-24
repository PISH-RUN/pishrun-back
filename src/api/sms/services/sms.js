"use strict";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const baseUrl = "https://api.ghasedak.me";
const apiKey = strapi.config.get("ghasedak.api");
const template = strapi.config.get("ghasedak.otp", "pishrun");

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
});
