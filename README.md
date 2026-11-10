<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/hackney-logo-dark.svg">
    <img src="docs/images/hackney-logo.svg" alt="Hackney" width="208">
  </picture>
</p>

<h1 align="center">Repairs Hub frontend</h1>

<p align="center">
  Where agents and managers raise, review, approve and close work orders,<br>
  and where operatives see their upcoming jobs and complete them.
</p>

<p align="center">
  <a href="#getting-set-up">Getting set up</a> ·
  <a href="#testing">Testing</a> ·
  <a href="#ci-environments-and-deployments">Deployments</a> ·
  <a href="#authentication-and-user-permissions">Authentication</a> ·
  <a href="#pages-routes-and-the-node-api">Pages and the API</a>
</p>

## What it's built on

It's a [Next.js](https://nextjs.org) app, styled with the [Hackney Design System](https://design-system.hackney.gov.uk/). The codebase started out as JavaScript and is slowly moving to TypeScript, so you'll find a mix of `.js`, `.ts` and `.tsx` files. New code should be TypeScript.

It talks to a few other things:

- The [Service API for Repairs](https://github.com/LBHackney-IT/repairs-api-dotnet), which is where most of the data comes from. We use a [custom App with getInitialProps](https://nextjs.org/docs/advanced-features/custom-app), which means every page is rendered on the server.
- [Amazon Cognito](https://aws.amazon.com/cognito/), through [next-auth](https://next-auth.js.org), for logging in. Staff sign in with their Hackney Google account, and Cognito passes on the Google groups they belong to. See [Authentication](#authentication-and-user-permissions).
- DRS, the third-party scheduling software. See [the DRS section](#drs-web-booking-manager-flow).

It's deployed with the Serverless Framework (see [serverless.yml](serverless.yml)) and built and tested on [CircleCI](https://app.circleci.com/pipelines/github/LBHackney-IT/repairs-hub-frontend?filter=all), configured in [.circleci/config.yml](.circleci/config.yml).

## Getting set up

The app runs on Node 24. If you use [NVM](https://github.com/nvm-sh/nvm), `nvm use` picks the right version from `.nvmrc`. We use yarn, so please stick to it rather than npm, otherwise you'll end up with a second lockfile.

```sh
git clone git@github.com:LBHackney-IT/repairs-hub-frontend.git
cd repairs-hub-frontend
yarn install
```

### Environment

Copy `.env.local.sample` to `.env.local`, which is gitignored, and fill it in. The sample only lists which variables exist. The real values are kept somewhere safe at Hackney, and most can be found in AWS Parameter Store in the development account. Ask a teammate if you're not sure where to look. The tests have their own sample, `.env.test.local.sample`. See [Environment variables](#environment-variables) for how values reach CI and the deployed environments.

### Logging in locally

Sign-in goes through Cognito to Google, so you need a `@hackney.gov.uk` Google account that's in at least one of the groups Repairs Hub recognises. If you can sign in but land on "Access denied", your groups don't give you a role, so speak to Hackney IT.

Locally the app runs at `http://localhost:5001`, so set `NEXTAUTH_URL=http://localhost:5001` in `.env.local`. The Cognito app client has to allow `http://localhost:5001/api/auth/callback/cognito` as a callback URL and `http://localhost:5001/login` as a sign-out URL, otherwise Cognito refuses to sign you in or out. If they aren't registered yet, ask whoever manages the user pool.

```sh
yarn dev
```

Then open [http://localhost:5001](http://localhost:5001).

## Testing

Most of the testing is Jest and React Testing Library (`yarn test:unit`). Cypress (`yarn test:e2e`) is slower and harder to keep stable, so we keep it for what only a real browser can check. That includes the authentication code: the session, group mapping, the page gate, signing out and the API routes are all covered by unit and integration tests that don't need a real Cognito.

The Cypress specs don't sign in through Google. `cy.loginWith*Role()` builds a real next-auth session cookie for the role, encrypted with the app's own `NEXTAUTH_SECRET`, so the app treats the browser as signed in. The token inside is unsigned, so a spec that lets a request reach the real backend will fail. Intercept the API calls.

For that to work, the app and Cypress must read the same `NEXTAUTH_SECRET`, the same group settings, and `E2E_AGENT_GROUP`, `E2E_CONTRACTOR_GROUP` and `E2E_SECOND_CONTRACTOR_GROUP`, which are group names that match the agent and contractor regexes. `yarn test:e2e` runs with `NODE_ENV=test`, so both read `.env.test.local`, not `.env.local`. If a group doesn't give the role it should, Cypress fails straight away and says which one. Two specs also read `CYPRESS_NEXT_PUBLIC_OUT_OF_HOURS_LINK` and `CYPRESS_NEXT_PUBLIC_PROPERTIES_PAGE_SIZE`, which must match the app's own values.

One spec, `cypress/e2e/authentication.cy.ts`, signs in as a real Cognito test user to check that a real token and its claims work end to end. It's deliberately small. It needs `COGNITO_E2E_ISSUER`, `COGNITO_E2E_CLIENT_ID`, `COGNITO_E2E_USERNAME` and `COGNITO_E2E_PASSWORD`, and fails with a message naming any that are missing. The user is in a separate test pool, so its token is only good for these tests, and the password must only live in masked variables, never in the repo.

> [!NOTE]
> The Google sign-in itself isn't covered by any test, so check it by hand after changing the auth setup.

> [!TIP]
> If Cypress won't start from a VS Code terminal, unset `ELECTRON_RUN_AS_NODE`. And running the specs against `yarn dev` can be flaky, because the dev server rebuilds pages as it goes, so a production build (`yarn build`, `yarn start`) is more stable.

## CI, environments and deployments

On every push CircleCI runs lint and the unit tests (`tests`) plus the Cypress suite (`e2e`). There's also a `quality-checks` job that does a TypeScript check and audits our production dependencies. That one is there to keep us informed, and it doesn't block a deploy if it fails, so keep an eye on it.

Features and bug fixes go to `develop`. Merging there deploys automatically to the development environment, which is handy for developer or design previews.

To get something onto staging for QA and UAT, open a PR from `develop` to `main`. Merging to `main` deploys to staging automatically. If that works, the production deploy then waits for someone to approve it in the CircleCI UI.

The `e2e` job sets fake Cognito values (`COGNITO_DOMAIN`, `COGNITO_CLIENT_ID` and `NEXTAUTH_URL`) in the CircleCI config, because the specs check the sign-out redirect without following it. Its group settings, `NEXTAUTH_SECRET` and `COGNITO_E2E_*` values come from the CircleCI project settings.

The wiki has some [deployment tips](https://github.com/LBHackney-IT/repairs-hub-frontend/wiki/Deployments-and-Environment-variables) for preparing a production release, including how to trigger a manual production deploy.

## Feature toggles

Merges to `main` can contain several features and fixes at once, and not all of them will have been tested and approved. We don't want an urgent fix to get stuck behind something that isn't ready, so new features should sit behind a feature toggle.

Toggles are served by `/api/simple-feature-toggle` (`src/pages/api/simple-feature-toggle/index.ts`), which reads them from environment variables, for example `FOLLOW_ON_IS_EMERGENCY_FIELD_ENABLED`. To add one, add it to `SimpleFeatureToggleResponse` and to that route, then set the variable for each environment.

A handful of older toggles are set with `NEXT_PUBLIC_*` environment variables at build time. That approach is deprecated, so please don't add new ones.

In Cypress tests you can use `intercept` to stub the toggles response and switch a feature on or off.

## Environment variables

There are two kinds:

1. Variables starting with `NEXT_PUBLIC_` are exposed to the browser, so never put anything secret in them.
2. Everything else is server-side only. These are the secrets, so real values must never be committed. Only references to wherever they're stored.

Where a value comes from depends on how the app is being run:

- **Locally:** `.env.local` for the app, and `.env.test.local` for the tests.
- **On CI:** hardcoded values in the CircleCI config, and the CircleCI project settings. Config entries that start with `$` (like `$OUT_OF_HOURS_LINK_STAGING`) point at those project settings.
- **Deployed:** server-side variables live in AWS Parameter Store and are referenced from [serverless.yml](serverless.yml). Public variables are set in the CircleCI config, either hardcoded or pointing at CircleCI project settings.

### Authentication variables

- `NEXTAUTH_URL` is the public address of the app, which the sign-in callback and sign-out redirect are built from. Use `http` locally, because an `https` URL makes next-auth use a differently named session cookie.
- `NEXTAUTH_SECRET` encrypts the session cookie.
- `COGNITO_CLIENT_ID`, `COGNITO_CLIENT_SECRET`, `COGNITO_ISSUER` (the user pool address, `https://cognito-idp.<region>.amazonaws.com/<user pool id>`) and `COGNITO_DOMAIN` (the hosted UI domain, used to build the sign-out URL) describe the Cognito app client.
- Roles come from group names. `AGENTS_GOOGLE_GROUPNAME_REGEX` and `CONTRACTORS_GOOGLE_GROUPNAME_REGEX` are regular expressions. Every other role has an exact name setting ending in `_GOOGLE_GROUPNAME`, for example `OPERATIVES_GOOGLE_GROUPNAME`. The full list is in `src/utils/user.ts`.

A group setting that's empty or missing gives nobody that role. In a dotenv file, write the `$` at the end of a regex as `\$`, because Next treats a bare `$` as a variable. In a real environment variable, such as one in CircleCI, use a plain `$`.

## Pages, routes and the Node API

### Pages

Next.js works out routes from the folder structure under `src/pages`. Square brackets mark a dynamic part of the URL, so `src/pages/work-orders/[id]/index.tsx` handles `/work-orders/1000000`, and the `id` is available as `query.id`. When a page also has pages nested beneath it, the page itself goes in an `index` file.

A few examples:

- `/` is `src/pages/index.js`, the home page. What the user sees depends on their role.
- `/search` is `src/pages/search.tsx`.
- `/work-orders/1000000` is `src/pages/work-orders/[id]/index.tsx`.
- `/work-orders/1000000/tasks/abc/edit` is `src/pages/work-orders/[id]/tasks/[taskId]/edit.tsx`, with `query.id` and `query.taskId` both available.
- `/properties/1000000/raise-repair/new` lives under `src/pages/properties/[id]/raise-repair/`.

### The Node API

Next.js also lets you write API routes, and we use that to forward requests on to other APIs once the user has been authorised. Every route is wrapped in `authoriseServiceAPIRequest` (`src/utils/serviceApiClient.ts`), which replies with a 401 when there's no valid session. Anything the frontend requests under `/api` is handled by a file in `src/pages/api`. Most of the time that's the catch-all route, `src/pages/api/[...path].ts`, which passes the request straight on to the Service API. It handles anything that doesn't match a more specific route.

We have a few more specific routes where we need to do something extra, like feature toggling, hiding data from some roles, URL-encoding, or calling an API other than the Service API:

- `/api/properties/[id]` (`src/pages/api/properties/[id]/index.ts`) hides contact information from users who shouldn't see it.
- `/api/properties/search` (`src/pages/api/properties/search.ts`) passes the search text and page number on, and sets the page size from `NEXT_PUBLIC_PROPERTIES_PAGE_SIZE`.
- `/api/users/schedulerSession` (`src/pages/api/users/schedulerSession.ts`) asks DRS for an access token.

> [!WARNING]
> This catches people out. If the Service API returns one thing and your frontend code receives something different, a custom route in the Node API may be changing the data on the way through. Have a look in `src/pages/api` before you start questioning the backend.

## Authentication and user permissions

### Signing in

Sign-in uses next-auth with Cognito, and Google sits behind Cognito. The setup is in [authOptions.ts](src/utils/auth/authOptions.ts), and the handler is `src/pages/api/auth/[...nextauth].ts`.

After signing in, the session is kept in an encrypted cookie. It holds the Cognito id token, which is forwarded to the backend APIs, and the user's groups. The id token itself is never sent to the browser. The session lasts 4 hours, to match the id token. There's no refresh token, so when it expires the user signs in again.

### From groups to roles

A user's permissions come from the Google groups they belong to, which Cognito passes on in the `custom:groups` claim. [cognitoGroups.ts](src/utils/auth/cognitoGroups.ts) reads the claim, and [user.ts](src/utils/user.ts) maps the group names onto roles in Repairs Hub using the [group settings](#authentication-variables). To get the current user in a component, use the context in [UserContext](src/components/UserContext/index.js).

### Who can see what

The gate is `getInitialProps` in [`_app.tsx`](src/pages/_app.tsx), using `checkAuthorisation` from [authSession.ts](src/utils/auth/authSession.ts). There are two different outcomes:

- **Not signed in**, or the session has expired: redirected to `/login`. If it expires while someone is moving between pages, the app navigates to `/login` itself.
- **Signed in, but no role:** redirected to `/access-denied`. The same page appears when a user has a role that isn't allowed on that page.

`/login` and `/access-denied` are the only pages open to everyone.

Each page controls who can see it with a `permittedRoles` property, as you can see on the [home page](src/pages/index.js). A page with no `permittedRoles` is denied to everyone. For finer detail inside a page, like whether a certain button shows up, the logic is in [userPermissions.ts](src/utils/userPermissions.ts) and [workOrderActions.ts](src/utils/workOrderActions.ts).

There's also a [matrix of roles and page permissions](https://docs.google.com/spreadsheets/d/1mYI10Er9f-gvFKiA5bryL5PvD3KZkuK6DyKPz12bZYw/edit) if you want the overview.

### Signing out

The Sign out link goes to `/api/logout` (`src/pages/api/logout.ts`). That route closes the user's DRS session, clears the session cookies, and redirects to Cognito's `/logout` so the Cognito session ends too. Cognito then sends the user to `<NEXTAUTH_URL>/login`, which must be on the app client's allowed sign-out URLs. Failing to close the DRS session doesn't stop the sign-out.

## DRS Web Booking Manager flow

Some contractors get their appointments through our own calendar, and others through Hackney's scheduling software, DRS.

When a repair is raised with a POST to the `schedule` endpoint, the response can include `externallyManagedAppointment: true`. That means the job should be booked through the DRS web interface rather than our calendar.

To build a valid link into DRS, we have to generate a `sessionId` and add it to the URL as a query param. That happens in the `src/pages/api/users/schedulerSession.ts` route.

We record the user going to DRS as a Note on the work order. There's currently no other way to know they visited the external page, so the navigation itself is what we log.
