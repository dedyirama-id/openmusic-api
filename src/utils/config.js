const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },

  postgress: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    prototype: process.env.PGPORT,
  },

  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },

  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },

  redis: {
    server: process.env.REDIS_SERVER,
  },
};

module.exports = config;
