# Hackney Repairs Hub frontend

This is the frontend for Repairs Hub. Agents and managers use it to raise, review, approve and close work orders. Operatives get a "mobile working" view where they can sign in, see their upcoming jobs and complete them.

## What it's built on

It's a [Next.js](https://nextjs.org) app, styled with the [Hackney Design System](https://design-system.hackney.gov.uk/). The codebase started out as JavaScript and is slowly moving to TypeScript, so you'll find a mix of `.js`, `.ts` and `.tsx` files. New code should be TypeScript.

It talks to a few other things:

- The [Service API for Repairs](https://github.com/LBHackney-IT/repairs-api-dotnet), which is where most of the data comes from. We use a [custom App with getInitialProps](https://nextjs.org/docs/advanced-features/custom-app), which means every page is rendered on the server.
- Hackney's [Google oAuth service](https://github.com/LBHackney-IT/LBH-Google-auth) for logging in.
- DRS, the third-party scheduling software. See [the DRS section](#drs-web-booking-manager-flow) below.

It's deployed with the Serverless Framework (see [serverless.yml](serverless.yml)) and built and tested on [CircleCI](https://app.circleci.com/pipelines/github/LBHackney-IT/repairs-hub-frontend?filter=all), configured in [.circleci/config.yml](.circleci/config.yml).

## Getting set up

### Install

```sh
git clone git@github.com:LBHackney-IT/repairs-hub-frontend.git
```

The app runs on Node 24. If you use [NVM](https://github.com/nvm-sh/nvm), `nvm use` in the project folder will pick the right version from `.nvmrc`. We use yarn, so please stick to that rather than npm, otherwise you'll end up with a second lockfile.

```sh
yarn install
```

### Environment files

You'll need three local files, all of which are gitignored:

- `.env`
- `.env.local`
- `.env.test.local`

There are `.sample` versions of each to copy from, but they only show you which variables exist. The real values are kept somewhere safe at Hackney, and most of them can be found in AWS Parameter Store in the development account. Ask a teammate if you're not sure where to look.

If you need to add or change a variable for CI or a deployed environment, have a look at [the environment variables section](#environment-variables) first.

### Pre-commit hook

We use GitGuardian's `ggshield` to stop secrets being committed. Follow the [install guide](https://docs.gitguardian.com/ggshield-docs/integrations/git-hooks/pre-commit), then set the `GITGUARDIAN_API_KEY` environment variable. The key is in Parameter Store (Housing-Development).

### Logging in locally

You need a `@hackney.gov.uk` Google account that's in the right Google groups. If you can't log in, speak to Hackney IT.

The login only works from a `hackney.gov.uk` domain, so add this line to your `/etc/hosts` file to point one at your machine. We use `localdev.hackney.gov.uk`:

```
127.0.0.1       localdev.hackney.gov.uk
```

### Running it

```sh
yarn dev
```

Then open [http://localdev.hackney.gov.uk:5001](http://localdev.hackney.gov.uk:5001). Note that it's port 5001, and you need to use the hackney domain rather than plain localhost, otherwise login won't work.

## Everyday commands

- `yarn dev` starts the dev server on port 5001.
- `yarn lint` runs ESLint. `yarn lintfix` fixes what it can.
- `yarn tsc --noEmit` type checks the TypeScript files. No output means no errors. Typing isn't strict yet, so it only catches the obvious problems.
- `yarn build` makes a production build.

## Tests

### Unit tests

Unit tests use Jest and React Testing Library:

```sh
yarn test:unit
```

On Windows, use `yarn test:unit-windows` instead. If you've changed something on purpose and need to update the snapshots, `yarn test:unit-win-upd` does that.
### End-to-end tests

End-to-end tests use Cypress. This builds the app, starts it and runs the whole suite headless in Chrome:

```sh
yarn test:e2e
```

If you'd rather watch it run, start the app in one terminal with `yarn dev`, then open the Cypress window from another:

```sh
yarn cy:open
```

`yarn tests` runs the unit tests and then the end-to-end tests.

## CI, environments and deployments

On every push CircleCI runs lint and the unit tests (`tests`) plus the Cypress suite (`e2e`). There's also a `quality-checks` job that does a TypeScript check and audits our production dependencies. That one is there to keep us informed, and it doesn't block a deploy if it fails, so keep an eye on it.

Features and bug fixes go to `develop`. Merging there deploys automatically to the development environment, which is handy for developer or design previews.

To get something onto staging for QA and UAT, open a PR from `develop` to `main`. Merging to `main` deploys to staging automatically. If that works, the production deploy then waits for someone to approve it in the CircleCI UI.

The wiki has some [deployment tips](https://github.com/LBHackney-IT/repairs-hub-frontend/wiki/Deployments-and-Environment-variables) for preparing a production release, including how to trigger a manual production deploy.

## Feature toggles

Merges to `main` can contain several features and fixes at once, and not all of them will have been tested and approved. We don't want an urgent fix to get stuck behind something that isn't ready, so new features should sit behind a feature toggle.

Toggles are served at runtime by the [configuration-api](https://github.com/LBHackney-IT/configuration-api). To add or change one, raise a PR against `master` in the [configuration-api-files repo](https://github.com/LBHackney-IT/configuration-api-files), updating the JSON for every environment it applies to. The [previous PRs](https://github.com/LBHackney-IT/configuration-api-files/pulls?q=is%3Apr+is%3Aclosed+RH) are good examples to copy from.

A handful of older toggles are set with `NEXT_PUBLIC_*` environment variables at build time. That approach is deprecated, so please don't add new ones.

In Cypress tests you can use `intercept` to stub the toggles response and switch a feature on or off.

## Environment variables

There are two kinds:

1. Variables starting with `NEXT_PUBLIC_` are exposed to the browser, so never put anything secret in them.
2. Everything else is server-side only. These are the secrets, so real values must never be committed. Only references to wherever they're stored.

Where a value comes from depends on how the app is being run:

- **Locally:** the dotenv files. The app reads `.env` and `.env.local`, and the tests read `.env.test` and `.env.test.local`.
- **On CI:** the values come from dotenv files, from hardcoded values in the CircleCI config, and from the CircleCI project settings. Config entries that start with `$` (like `$OUT_OF_HOURS_LINK_STAGING`) point at those project settings.
- **Deployed:** server-side variables live in AWS Parameter Store and are referenced from [serverless.yml](serverless.yml). Public variables are set in the CircleCI config, either hardcoded or pointing at CircleCI project settings.

## Pages, routes and the Node API

### Pages

Next.js works out routes from the folder structure under `src/pages`. Square brackets mark a dynamic part of the URL, so `src/pages/work-orders/[id]/index.js` handles `/work-orders/1000000`, and the `id` is available as `query.id`. When a page also has pages nested beneath it, the page itself goes in an `index` file.

A few examples:

- `/` is `src/pages/index.js`, the home page. What the user sees depends on their role.
- `/search` is `src/pages/search.js`.
- `/work-orders/1000000` is `src/pages/work-orders/[id]/index.js`.
- `/work-orders/1000000/tasks/abc/edit` is `src/pages/work-orders/[id]/tasks/[taskId]/edit.js`, with `query.id` and `query.taskId` both available.
- `/properties/1000000/raise-repair/new` lives under `src/pages/properties/[id]/raise-repair/`.

### The Node API

Next.js also lets you write API routes, and we use that to forward requests on to other APIs once the user has been authorised. Anything the frontend requests under `/api` is handled by a file in `src/pages/api`. Most of the time that's the catch-all route, `src/pages/api/[...path].js`, which passes the request straight on to the Service API. It handles anything that doesn't match a more specific route.

We have a few more specific routes where we need to do something extra, like feature toggling, hiding data from some roles, URL-encoding, or calling an API other than the Service API:

- `/api/properties/[id]` (`src/pages/api/properties/[id]/index.ts`) hides contact information from users who shouldn't see it.
- `/api/properties/search` (`src/pages/api/properties/search.js`) switches between the new and deprecated backend search endpoints, depending on a toggle.
- `/api/toggles` (`src/pages/api/toggles.js`) calls the configuration API.
- `/api/users/schedulerSession` (`src/pages/api/users/schedulerSession.js`) asks DRS for an access token.

**This catches people out.** If the Service API returns one thing and your frontend code receives something different, a custom route in the Node API may be changing the data on the way through. Have a look in `src/pages/api` before you start questioning the backend.

## User permissions

Repairs Hub relies on [Hackney's Google oAuth service](https://github.com/LBHackney-IT/LBH-Google-auth), which provides a JWT for the logged-in user.

A user's permissions come from the Google groups they belong to. We read the groups after verifying the JWT in [googleAuth.js](src/utils/googleAuth.js), and [user.ts](src/utils/user.ts) maps those groups onto roles in Repairs Hub. To get the current user in a component, use the context in [UserContext](src/components/UserContext/index.js).

Each page controls who can see it with a `permittedRoles` property, as you can see on the [home page](src/pages/index.js). For finer detail inside a page, like whether a certain button shows up, the logic is in [userPermissions.ts](src/utils/userPermissions.ts) and [workOrderActions.js](src/utils/workOrderActions.js).

There's also a [matrix of roles and page permissions](https://docs.google.com/spreadsheets/d/1mYI10Er9f-gvFKiA5bryL5PvD3KZkuK6DyKPz12bZYw/edit) if you want the overview.

## DRS Web Booking Manager flow

Some contractors get their appointments through our own calendar, and others through Hackney's scheduling software, DRS.

When a repair is raised with a POST to the `schedule` endpoint, the response can include `externallyManagedAppointment: true`. That means the job should be booked through the DRS web interface rather than our calendar.

To build a valid link into DRS, we have to generate a `sessionId` and add it to the URL as a query param. That happens in the `src/pages/api/users/schedulerSession.js` route.

We record the user going to DRS as a Note on the work order. There's currently no other way to know they visited the external page, so the navigation itself is what we log.
