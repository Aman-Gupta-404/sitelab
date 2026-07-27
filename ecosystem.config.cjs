const path = require("path");

module.exports = {
  apps: [
    {
      name: "sitelab-api",
      cwd: path.join(__dirname, "apps/backend"),
      script: "dist/server.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "sitelab-worker",
      cwd: path.join(__dirname, "apps/backend"),
      script: "dist/workers/index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "sitelab-frontend",
      cwd: path.join(__dirname, "apps/frontend"),
      script: "pnpm",
      args: "start",
      interpreter: "none",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};
