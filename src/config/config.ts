export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.AUTH_USER,
    password: process.env.AUTH_PASSWORD,
  },
});
