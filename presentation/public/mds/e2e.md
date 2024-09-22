## End-to-end (e2e) Testing

- Aims to test a system's overall behavior (against user expectations)

- More realistic than unit testing

- More expensive and time consuming

[__note] The testing we did for the card manager functionality was unit testing, where we tested individual logical units of our application, now we're also going to add e2e tests

=|=

![Testing Pyramid](imgs/testing-pyramid.png)

[__note] Testing pyramid is a common testing strategy, it shows few e2es (which are expensive and slow) and many unit tests (which are inexpensive and fast), with integration tests in the middle (we'll explore these in a later section with playwright component testing)

=-=

## <img src="imgs/playwright-logo.svg" alt="Playwright logo" width="100"/> Playwright

- E2E Testing framework from Microsoft

- Fast and intuitive

- Many features such as auto reties, trace viewers, codegen, etc...

- Multi browser and multi languages support

- Alternatives: cypress, puppeteer, etc...

=-=

## Getting Started with Playwright

<br />

https://playwright.dev/docs/intro

<br />

```sh
npm init playwright@latest
```

<br />

```sh
npx playwright
```

=-=

## Playwright codegen

```sh
npx playwright codegen
```

<img src="imgs/playwright-codegen-screenshot.png" alt="Playwright Codegen screenshot" width="800"/>

[__note] here I pause and just quickly show a demo of codegen

=-=

## Playwright Exercise

Let's implement an e2e test that tests our card generation logic

Readme: `<repo>/exercises/n-e2e/README.md`

Git tag: `n-e2e-exercise`

[__note] the git tag points to the tag that attendees can jump to if they have fallen behind, the README contains the exercise instructions:

- update playwright config to use `wrangler pages dev`
- mock out ai binding
- implement test (using codegen)
