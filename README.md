# React Summit US Nov 2024 Demo App

Repo for our CF Devplat workshop. We're using NPM to manage the project.

## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Tests

There are multiple test suites. To run workers based tests with `vitest-pool-workers`:

```sh
npm run build:mocks # only needs to be run once
npm run test:workers
```

To run e2e and component playwright tests:

```sh
npx playwright install # only needs to be run once
npm run test:e2e
npm run test:ct
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
