module.exports = {
  apps: [
    {
      name: "sitelab-api",
      cwd: "./aps/backend",
      script: "dist/server.js",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "sitelab-worker",
      cwd: "./aps/backend",
      script: "dist/workers/index.js",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
