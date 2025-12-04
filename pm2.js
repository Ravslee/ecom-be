module.exports = {
  apps: [
    {
      name: "ecomm-api",
      script: "src/index.js",
      env_production: {
        ENV_FILE: ".env.prod",
      },
      env_development: {
        ENV_FILE: ".env.dev",
      },
    },
  ],
};
