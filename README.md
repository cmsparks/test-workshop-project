# React Summit US Nov 2024 Demo App

Repo for our CF Devplat workshop. We're using Turborepo and PNPM to manage the project.

## Important directories

- `/packages/eslint-config`:Reusable eslint configs for our packages/apps
- `/packages/tools`: Useful tools/scripts/snippets which can be reused throughout the repo
- `/packages/typescript-config`: Reusable typescript configs for our packages/apps
- `/apps/demo-worker`: Demo worker to scaffold/test our turborepo configuration

## Turbo tasks

- `pnpm turbo build`: Builds everything in the repo (only 1 worker)
- `pnpm turbo deploy`: Deploys everything in the repo (currently only 1 worker)
- `pnpm turbo check`: Runs lint and typecheck tasks across all packages/apps in the repo
- `pnpm turbo dev`: Runs everything in dev. This is currently a bit broken due to turbo, we should probably just spin up a dev environment through a separate script rather than through turbo
