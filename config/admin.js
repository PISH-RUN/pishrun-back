module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f08428a650f69243c9f9912643ca3c49'),
  },
});
