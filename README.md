# Hackney Repairs Hub frontend

This is the Hackney Repairs frontend application which allows agents to securely access information from Hackney Repairs API about Hackney properties, and to raise new repair requests.

## Preflight

### How it's made

It's a [Next.js](https://nextjs.org) app that works with:

- Hackney's [repairs API](https://github.com/LBHackney-IT/repairs-api)
- Hackney's [Google oAuth service](https://github.com/LBHackney-IT/LBH-Google-auth)

It's built using [Hackney Design System](https://github.com/LBHackney-IT/lbh-frontend).

### Clone the project

```sh
$ git clone git@github.com:LBHackney-IT/repairs-hub-frontend.git
```

## Building the project for local development

The app needs Node 14, if you have [NVM](https://github.com/nvm-sh/nvm) installed just run `nvm use` in your terminal.

### Setup

Install the dependencies:

```bash
yarn install
```

### Logging in

First, you need a `@hackney.gov.uk` Google account in the right groups to log in. Speak to Hackney IT if you don't have these.

Next, you need to tell your computer to run the app from a `hackney.gov.uk` domain. Let's use `localdev.hackney.gov.uk`. You will need to add the following line to your `/etc/hosts` file:

```
127.0.0.1       localdev.hackney.gov.uk
```

Lastly, create your `.env` file from `.env.sample`. You will need to grab some secrets from the team.

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

Individual Cypress end to end spec file using headlessly in the Electron default browser can be run using the following command:

```
yarn e2e:server 'cypress run --spec cypress/integration/home_page.spec.js'
```

### Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.

## Continuous Delivery

Our serverless deployment service is configured in [serverless.yml](serverless.yml).

The serverless service includes the following:

- a single serverless function: repairs-hub-frontend
- Description of the Cloudfront CDN in CloudFormation
- Custom subdomain under hackney.gov.uk
