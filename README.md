# Hackney Repairs Hub frontend

Allows agents and managers to raise, review, approve and close work orders.

Allows operatives to sign in to a "mobile working" view, see upcoming jobs and complete them.

### Dependencies

It's a [Next.js](https://nextjs.org) app that works with:

- [Repairs API](https://github.com/LBHackney-IT/repairs-api-dotnet)
- Hackney's [Google oAuth service](https://github.com/LBHackney-IT/LBH-Google-auth)

It's built using [Hackney Design System](https://design-system.hackney.gov.uk/).

## Development Setup

### Clone the project

```sh
git clone git@github.com:LBHackney-IT/repairs-hub-frontend.git
```

The app needs Node 14, if you have [NVM](https://github.com/nvm-sh/nvm) installed just run `nvm use` in your terminal.

Install the dependencies:

```sh
yarn install
```

### Environment variables

Create a `.env` file. You will need to grab several secrets from the team to include.

If you need to add or change a variable, first see the 'Managing environment variables' section, below.

### Authentication

You need a `@hackney.gov.uk` Google account with the correct Google group membership to log in. Speak to Hackney IT if you don't have this.

Next, you need to tell your computer to run the app from a `hackney.gov.uk` domain. Let's use `localdev.hackney.gov.uk`. You will need to add the following line to your `/etc/hosts` file:

```
127.0.0.1       localdev.hackney.gov.uk
```

### Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localdev.hackney.gov.uk:5000/](http://localdev.hackney.gov.uk:5000/) with your browser to see the result.

### Tests

This application is using Jest, `react-testing-library`, for unit tests and can be run using the following command:

```
yarn test:unit
```

To keep the unit test output clear of known and expected console output we can make use of [jest-clean-console-reporter](https://github.com/jevakallio/jest-clean-console-reporter). Rules can be added to `./reporter-rules.json` to suppress or group commands.

This application is using cypress, for end-to-end and integration tests and can be run using the following command:

```
yarn test:e2e
```

The full test suite including unit tests and system tests can be run using following command:

```
yarn tests
```

Run an individual Cypress spec can be run using the following command:

```
yarn e2e:server 'cypress run --spec cypress/integration/home_page.spec.js'
```

## Managing environment variables

### Types of environment variables

This project makes use of two types of environment variables:

1. Public variables which have the prefix `NEXT_PUBLIC_` - these are exposed and used in the browser.
2. Server side only variables (without the above prefix). These are secrets and therefore real values should never be committed to the codebase - only references to secret storage should be used.

### Where values are set

This project sets environment variables in multiple places. Which values are used depends on where and how the code is being run.

Variables are referenced and stored in the following places:

- dotenv files (either `.sample.env` or `.env`)
- Hard coded exported variables in commands in the [Circle CI config file](./.circleci/config.yml).
- Exported variables in commands in the [Circle CI config file](./.circleci/config.yml) which reference [Cypress project settings](https://app.circleci.com/settings/project/github/LBHackney-IT/repairs-hub-frontend/environment-variables?return-to=https%3A%2F%2Fapp.circleci.com%2Fpipelines%2Fgithub%2FLBHackney-IT%2Frepairs-hub-frontend%3Ffilter%3Dall).
  These references are made using the cypress `$` prefix. (Example `$OUT_OF_HOURS_LINK_STAGING`).
- AWS Parameter Store for a given environment, referenced from the [serverless config file](./serverless.yml)

### Tests

When running unit tests, only the `sample.env` file is used to set environment variables. This is true for both local and CI builds.

When running integration tests locally, the .env file is used.

When running integration tests on Circle CI, values are from the Circle project settings and from hardcoded values in the CircleCI config file.

### Local and deployed applications

When running the application locally, the .env file is used for setting environment variables.

When running the application in all deployed environments, server side environment variables are stored in AWS Parameter store (referenced in serverless.yml). Public variables are in the Circle CI config file - they are either hardcoded directly or they reference variables in Cypress project settings.

## Deployments

Our serverless deployment service is configured in [serverless.yml](serverless.yml).

Continuous integration is managed with [CircleCI](https://app.circleci.com/pipelines/github/LBHackney-IT/repairs-hub-frontend?filter=all).

See the wiki page for some [deployment tips](https://github.com/LBHackney-IT/repairs-hub-frontend/wiki/Deployments-and-Environment-variables)
