// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  app: {
    port: process.env.PORT || 6001, // node js server port
    env: process.env.NODE_ENV,
    https: process.env.HTTPS,
  }

};
