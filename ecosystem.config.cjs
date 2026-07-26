module.exports = {
  apps: [
    {
      name: "sitelab-api",
      cwd: "./apps/backend",
      script: "dist/server.js",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "sitelab-worker",
      cwd: "./apps/backend",
      script: "dist/workers/index.js",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
