# React Summit US Nov 2024 Demo App

Repo for our CF Devplat workshop. We're using PNPM to manage the project.

## Development

Run the dev server:

```sh
pnpm run dev
```

To run Wrangler:

```sh
pnpm run build
pnpm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
pnpm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Tests

There are multiple test suites. To run workers based tests with `vitest-pool-workers`:

```sh
pnpm run build:mocks # only needs to be run once
pnpm run test:workers
```

To run e2e and component playwright tests:

```sh
pnpm exec playwright install # only needs to be run once
pnpm run test:e2e
pnpm run test:ct
```

## Deployment

First, build your app for production:

```sh
pnpm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
pnpm run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
