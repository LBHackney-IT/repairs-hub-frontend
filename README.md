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

Create your `.env` file from `.env.sample`. You will need to grab some secrets from the team.

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

Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.

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

## Continuous Delivery

Our serverless deployment service is configured in [serverless.yml](serverless.yml).

## Deployment Tips

See https://github.com/LBHackney-IT/repairs-hub-frontend/wiki/Deployments-and-Environment-variables
