# Hackney Repairs Hub frontend

Allows agents and managers to raise, review, approve and close work orders.

Allows operatives to sign in to a "mobile working" view, see upcoming jobs and complete them.

## Dependencies

It's a [Next.js](https://nextjs.org) app that works with:

- [Service API for Repairs](https://github.com/LBHackney-IT/repairs-api-dotnet). Note that we are using a [custom 'App' with getInitialProps](https://nextjs.org/docs/advanced-features/custom-app) which causes all pages to be server-side rendered.
- Hackney's [Google oAuth service](https://github.com/LBHackney-IT/LBH-Google-auth)
- [DRS Web Booking Manager (third-party work scheduler)](#drs-web-booking-manager-flow)

It's built using [Hackney Design System](https://design-system.hackney.gov.uk/).

Serverless deployment is configured in [serverless.yml](serverless.yml).

Continuous integration is managed with [CircleCI](https://app.circleci.com/pipelines/github/LBHackney-IT/repairs-hub-frontend?filter=all), configured in [circleci/config.yml](/.circleci/config.yml).

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

### Local environment variables (dotenv)

Create the following files to store local secrets (which are gitignored):

- `.env`
- `.env.local`
- `.env.test.local`

Populate this with a set of variables. This should be stored in a safe place in Hackney. Most of the important values to be assigned to these are found within AWS Parameter store for the development account. Ask a team member if unsure.

If you need to add or change a variable on CI or a deployed environment, first see the 'Managing environment variables' section below.

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

Run tests individually in Cypress GUI:

```
yarn e2e:interactive
```

Run an individual Cypress spec can be run using the following command:

```
yarn e2e:server 'cypress run --spec cypress/integration/home_page.spec.js'
```

The full test suite including unit tests and system tests can be run using following command:

```
yarn tests
```

## Environments and deployments

Features and bugfixes should be raised against `develop`. Merging to develop [triggers automated deployment to the development environment](https://github.com/LBHackney-IT/repairs-hub-frontend/blob/main/.circleci/config.yml#L205). This can be used for developer or design previews.

To update staging (and make the feature available for QA/UAT), make a PR from `develop` to `main`. Merging to `main` [triggers automated deployment to the staging environment](https://github.com/LBHackney-IT/repairs-hub-frontend/blob/main/.circleci/config.yml#L219).

If the staging deployment above is successful, a production deploy is [pending manual approval in the Circle CI UI](https://github.com/LBHackney-IT/repairs-hub-frontend/blob/main/.circleci/config.yml#L221) before a deployment to the production environment.

See the wiki page for some [deployment tips](https://github.com/LBHackney-IT/repairs-hub-frontend/wiki/Deployments-and-Environment-variables) when preparing a production release, including how to trigger a manual prodution deploy.

## Feature toggles

Our git branching strategy means that multiple features / bugfixes can be in the same merge commit to `main`. Some may be tested and approved, and some may not. To avoid a situation where an urgent, tested fix is blocked from release by testing of another feature, features should be behind feature toggles.

We use the [configuration-api](https://github.com/LBHackney-IT/configuration-api) to provide new run-time toggles - see below for how to set them in the associated config repo. (Note, however, at the time of writing there are a small amount of feature toggles made by setting environment variables at build-time (i.e. in the format `NEXT_PUBLIC_*`), but this technique is deprecated.)

To add or edit a toggle, raise a PR against `master` in the [configuration-api-files repo](https://github.com/LBHackney-IT/configuration-api-files) to update the JSON object for every relevant environment. [Previous example PRs](https://github.com/LBHackney-IT/configuration-api-files/pulls?q=is%3Apr+is%3Aclosed+RH) demonstrate this.

You can use Cypress `intercept` commands (request stubbing) to enable or disable the relevant feature toggle in integration tests.

## Environment variables

### Types of environment variables

This project makes use of two types of environment variables:

1. Public variables which have the prefix `NEXT_PUBLIC_` - these are exposed and used in the browser.
2. Server side only variables (without the above prefix). These are secrets and therefore real values should never be committed to the codebase - only references to secret storage should be used.

### Where values are set

This project sets environment variables in multiple places. Which values are used depends on where and how the code is being run.

When running locally, dotenv files are used. `.env`, `.env.local` are used when running the app and `.env.test` and `.env.test.local` are used when running tests.

In deployed environments, environment variables are used from the following places:

- Hard coded exported variables in commands in the [Circle CI config file](./.circleci/config.yml).
- Exported variables in commands in the [Circle CI config file](./.circleci/config.yml) which reference [CircleCI project settings](https://app.circleci.com/settings/project/github/LBHackney-IT/repairs-hub-frontend/environment-variables?return-to=https%3A%2F%2Fapp.circleci.com%2Fpipelines%2Fgithub%2FLBHackney-IT%2Frepairs-hub-frontend%3Ffilter%3Dall).
  These references are made using the `$` prefix. (Example `$OUT_OF_HOURS_LINK_STAGING`).
- AWS Parameter Store for a given environment, referenced from the [serverless config file](./serverless.yml)

### CI Builds

When running integration tests on Circle CI, values are from dotenv files, the CircleCI project settings and from hardcoded values in the CircleCI config file.

### Deployed applications

When running the application in all deployed environments, server side environment variables are stored in AWS Parameter store (referenced in serverless.yml). Public variables are in the Circle CI config file - they are either hardcoded directly or they reference variables in CirceCI project settings.

## Pages, routes and the Node API

#### Pages

Next JS uses file-based routing. In order to work out how a URL maps to a specific page, look at the directory structure under `src/pages`. Dynamic URL parameters such as an order id are denoted using square brackets (e.g. `[id].js`), which capture the named parameter and make it available in the relevant page component.

If a page maps to a url but also is the start of another url nested beneath it, an `index.js` file at that location is used. See table below for examples.

#### API pages

**Next JS includes a Node API.** In Repairs Hub we use this feature to forward requests to other APIs following authorisation of the user. In particular, the [Service API for Repairs](https://github.com/LBHackney-IT/repairs-api-dotnet) is used for the majority of upstream calls.

Requests made from the frontend to a path starting `/api` will be routed to pages under the `src/pages/api` directory in the app (see table below). In most cases, the API passes the request straight through to the backend service API using a "catch all" endpoint (`src/pages/api/[...path].js`) - the square brackets and dotted notation means that "catch-all" endpoint will handle any API request which does not match a more specific route. We use more specific Node API routes in a few places to help with feature toggling, data redaction based on user role, and url-encoding, or sending requests to APIs other than the service API.

**This leads to an important "gotcha" while developing.** If an expected service API response does not match what's received by the frontend code, it's possible that a custom route in the intermediate Node API is processing or intercepting the request to change the received data. Check the API directory to see if there are any custom routes which might be transforming the request data.

Some more specific routes at the time of writing are below:

- Requesting a property can include contact information. Some users should not see that, and the response data anonymisation is done in the frontend API (`src/pages/api/properties/[id]/index.js`)
- Property search has been used to feature toggle integration with a new vs deprecated backend search endpoint, so there is logic to control this first in the Node API (`src/pages/api/properties/search.js`)

## Example paths, route mapping and notes

| path                                     | file location                                      | notes                                                                 |
| ---------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| `/`                                      | /src/pages/index.js                                | home page, user is displayed component based on role                  |
| `/search`                                | /src/pages/search.js                               |                                                                       |
| `/work-orders/1000000`                   | /src/pages/work-orders/[id]/index.js               | id accessible via query.id                                            |
| `/properties/1000000/raise-repair/new`   | /properties/[id]/raise-repair/new                  | id accessible via query.id                                            |
| `/work-orders/1000000/tasks/abc/edit.js` | /src/pages/work-orders/[id]/tasks/[taskId]/edit.js | id and taskID accessible via query.id and query.taskId                |
| `/api/work-orders/1000000`               | /src/pages/api/[...path].js                        | The default ("catch-all") API route. Forwards to service API.         |
| `/api/properties/1000000`                | /src/pages/api/properties/[id].js                  | Takes precedence over default API route. Redacts info for some users. |
| `/api/toggles`                           | /src/pages/api/toggles.js                          | Calls configuration API                                               |
| `/api/users/schedulerSession`            | /src/pages/api/users/schedulerSession.js           | Calls DRS to generate access token                                    |

## User permissions and authorisation

Repairs Hub depends on [Hackney's Google oAuth service](https://github.com/LBHackney-IT/LBH-Google-auth) to provide a JWT representing the Hackney user.

Permissions are based on membership of one or more Google groups created for the Repairs team, found after verifying the user's Google JWT in [`googleAuth.js`](https://github.com/LBHackney-IT/repairs-hub-frontend/blob/develop/src/utils/googleAuth.js). The mappings between Google groups and roles within Repairs Hub is maintained within [`user.js`](https://github.com/LBHackney-IT/repairs-hub-frontend/blob/develop/src/utils/user.js). Access to the logged-in user can be achieved by using [`UserContext.js`](https://github.com/LBHackney-IT/repairs-hub-frontend/blob/develop/src/components/UserContext/index.js).

Refer to this [matrix of user page permissions](https://accounts.google.com/ServiceLogin/webreauth?service=wise&passive=1209600&continue=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1mYI10Er9f-gvFKiA5bryL5PvD3KZkuK6DyKPz12bZYw%2Fedit&followup=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1mYI10Er9f-gvFKiA5bryL5PvD3KZkuK6DyKPz12bZYw%2Fedit&ltmpl=sheets&authuser=0&flowName=GlifWebSignIn&flowEntry=ServiceLogin#gid=0) for an overview of the roles and page permissions.

Access to an individual page is controlled by the `permittedRoles` attribute on the page component. For example, the home page can be accessed by everyone and contains [this list of permitted users](https://github.com/LBHackney-IT/repairs-hub-frontend/blob/develop/src/pages/index.js#L75-L81).

Logic for finer-grained access control for features within a page such as buttons are currently found in [userPermissions.js](/src/utils/userPermissions.js) and also [workOrderActions.js](/src/utils/workOrderActions.js).

## DRS Web Booking Manager flow

Repairs raised for some contractors are given appointments using our own calendar. Others are given appointments via Hackney's scheduling software - DRS.

A repair raise request, via a POST to the `schedule` endpoint, can return a field `externallyManagedAppointment` set to `true`. This indicates that the order can be booked using a web interface to DRS, as opposed to using our own internal calendar view.

To create a valid link, we are required to generate a `sessionId`, appended as a query param. This is achieved in the `src/pages/api/users/schedulerSession.js` API route endpoint.

The user's navigation to DRS is currently logged as a Note. (At the time of writing there is no other way to know the user visited the external page, so we log the navigation instead.)
