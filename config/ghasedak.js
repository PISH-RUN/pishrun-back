module.exports = ({ env }) => ({
  api: env("GHASEDAK_API_KEY"),
  otp: env("GHASEDAK_OTP"),
});
