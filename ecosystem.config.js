// PM2 process definition. Stable name so deploys reload by name, not numeric id.
// The app loads its own .env via `import "dotenv/config"` (see src/env/index.ts).
module.exports = {
  apps: [
    {
      name: "udv-plantio-back",
      script: "dist/server.js",
      cwd: "/root/projects/udv-plantio-back",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
