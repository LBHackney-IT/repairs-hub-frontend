# Hackney Repairs Hub frontend

This is the frontend for Repairs Hub. Agents and managers use it to raise, review, approve and close work orders. Operatives get a "mobile working" view where they can sign in, see their upcoming jobs and complete them.

## What it's built on

It's a [Next.js](https://nextjs.org) app, styled with the [Hackney Design System](https://design-system.hackney.gov.uk/). The codebase started out as JavaScript and is slowly moving to TypeScript, so you'll find a mix of `.js`, `.ts` and `.tsx` files. New code should be TypeScript.

It talks to a few other things:

- The [Service API for Repairs](https://github.com/LBHackney-IT/repairs-api-dotnet), which is where most of the data comes from. We use a [custom App with getInitialProps](https://nextjs.org/docs/advanced-features/custom-app), which means every page is rendered on the server.
- [Amazon Cognito](https://aws.amazon.com/cognito/), through [next-auth](https://next-auth.js.org), for logging in. Staff sign in with their Hackney Google account, and Cognito passes on the Google groups they belong to. See [Authentication and user permissions](#authentication-and-user-permissions).
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

Sign-in goes through Cognito to Google, so you need a `@hackney.gov.uk` Google account that's in at least one of the groups Repairs Hub recognises (see [Authentication and user permissions](#authentication-and-user-permissions)). If you can sign in but land on an "Access denied" page, your groups don't give you a role. Speak to Hackney IT if you need adding to a group.

Set `NEXTAUTH_URL` in `.env.local` to the address you open the app on, for example `http://localhost:5001`. The Cognito app client has to list `<NEXTAUTH_URL>/api/auth/callback/cognito` as an allowed callback URL, and `<NEXTAUTH_URL>/login` as an allowed sign-out URL. Without them Cognito refuses to sign you in or out. If your local address isn't registered yet, ask whoever manages the user pool.

### Running it

```sh
yarn dev
```

Then open the address you set in `NEXTAUTH_URL`. The app runs on port 5001. Use exactly that address, because the session cookie and the Cognito callback are tied to it.

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

The authentication code has its own tests and none of them need a real Cognito:

- `src/utils/auth/*.test.ts` cover the session, groups, tokens and cookies.
- `__test__/_app.getInitialProps.test.ts`, `__test__/login.test.ts` and `__test__/access-denied.test.ts` cover the page gate and the login and access denied pages.
- `src/pages/api/logout.test.ts` covers signing out, and each API route has a test next to it.
- `factories/session_cookie.ts` builds the same encrypted session cookie a real sign-in produces, and `factories/api_route.ts` builds a signed-in request for the API route tests.

### End-to-end tests

End-to-end tests use Cypress. This builds the app, starts it and runs the whole suite headless in Chrome:

```sh
yarn test:e2e
```

If you'd rather watch it run, start the app in one terminal, then open the Cypress window from another:

```sh
yarn cy:open
```

For a more stable run, start the app with a production build (`yarn build` then `yarn start`) instead of `yarn dev`. The dev server rebuilds pages as it goes, which can show up as slow tests or "module factory is not available" errors in the browser.

`yarn tests` runs the unit tests and then the end-to-end tests.

#### How the tests sign in

The specs don't go through Google. `cy.loginWith*Role()` asks a Cypress task (`cypress/plugins/sessionCookie.ts`) for a session cookie. The task encrypts it with the app's own `NEXTAUTH_SECRET`, and it holds the Cognito groups for that role, so the app treats the browser as signed in. The token inside is unsigned, so a spec that lets a request reach the real backend will fail. Intercept the API calls.

The app and Cypress have to read the same values for these, or roles won't match and pages show "Access denied":

- `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (use `http://localhost:5001`, an `https` URL changes the cookie name).
- The group settings described in [Authentication variables](#authentication-variables).
- `E2E_AGENT_GROUP`, `E2E_CONTRACTOR_GROUP` and `E2E_SECOND_CONTRACTOR_GROUP`: group names for the agent, contractor and multiple-contractor roles. They must match `AGENTS_GOOGLE_GROUPNAME_REGEX` and `CONTRACTORS_GOOGLE_GROUPNAME_REGEX`. The task fails with a clear message if one doesn't give the role it should.

`yarn test:e2e` runs with `NODE_ENV=test`, so both the app and Cypress read `.env.test.local`, not `.env.local`.

Two specs read values through `Cypress.env`, so they need `CYPRESS_NEXT_PUBLIC_OUT_OF_HOURS_LINK` and `CYPRESS_NEXT_PUBLIC_PROPERTIES_PAGE_SIZE`, matching the app's own settings.

If Cypress fails to start from a VS Code terminal with "bad option: --no-sandbox", unset `ELECTRON_RUN_AS_NODE` for the command.

#### Testing a real Cognito sign-in

`cypress/e2e/authentication.cy.ts` also signs in as a real Cognito test user. These tests need the variables below, and fail with a message naming any that are missing. Use masked variables in CI, and never commit the password:

```
COGNITO_E2E_ISSUER=https://cognito-idp.<region>.amazonaws.com/<user pool id>
COGNITO_E2E_CLIENT_ID=<a public app client id that allows USER_PASSWORD_AUTH>
COGNITO_E2E_USERNAME=
COGNITO_E2E_PASSWORD=
```

The test user lives in a separate pool, so its token is only good for these tests and the real backend won't accept it. The task signs in, checks the token against the pool's keys, and passes it through the app's own `jwt` callback before building the cookie. It doesn't go through the Google sign-in, so that part still needs a manual check.

## CI, environments and deployments

On every push CircleCI runs lint and the unit tests (`tests`) plus the Cypress suite (`e2e`). There's also a `quality-checks` job that does a TypeScript check and audits our production dependencies. That one is there to keep us informed, and it doesn't block a deploy if it fails, so keep an eye on it.

Features and bug fixes go to `develop`. Merging there deploys automatically to the development environment, which is handy for developer or design previews.

To get something onto staging for QA and UAT, open a PR from `develop` to `main`. Merging to `main` deploys to staging automatically. If that works, the production deploy then waits for someone to approve it in the CircleCI UI.

The `e2e` job sets test-only Cognito values (`COGNITO_DOMAIN`, `COGNITO_CLIENT_ID` and `NEXTAUTH_URL`) in [.circleci/config.yml](.circleci/config.yml). They're fake because the specs check the sign-out redirect without following it. The group settings and `NEXTAUTH_SECRET` for the e2e job come from the CircleCI project settings.

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

- **Locally:** the dotenv files. The app reads `.env` and `.env.local`, and the tests read `.env.test` and `.env.test.local`.
- **On CI:** the values come from dotenv files, from hardcoded values in the CircleCI config, and from the CircleCI project settings. Config entries that start with `$` (like `$OUT_OF_HOURS_LINK_STAGING`) point at those project settings.
- **Deployed:** server-side variables live in AWS Parameter Store and are referenced from [serverless.yml](serverless.yml). Public variables are set in the CircleCI config, either hardcoded or pointing at CircleCI project settings.

### Authentication variables

- `NEXTAUTH_URL` is the public address of the app. The sign-in callback and the sign-out redirect are built from it. Use `http` locally, because an `https` URL makes next-auth use a differently named session cookie.
- `NEXTAUTH_SECRET` encrypts the session cookie.
- `COGNITO_CLIENT_ID` and `COGNITO_CLIENT_SECRET` identify the Cognito app client the app signs in with.
- `COGNITO_ISSUER` is the user pool's address, `https://cognito-idp.<region>.amazonaws.com/<user pool id>`.
- `COGNITO_DOMAIN` is the hosted UI domain. Signing out builds its Cognito logout URL from it.
- `AGENTS_GOOGLE_GROUPNAME_REGEX` and `CONTRACTORS_GOOGLE_GROUPNAME_REGEX` are regular expressions matching the group names that give the agent and contractor roles.
- The other roles are matched by exact group name: `CONTRACT_MANAGERS_GOOGLE_GROUPNAME`, `CONTRACTOR_CAN_CANCEL_GOOGLE_GROUPNAME`, `AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME`, `OPERATIVES_GOOGLE_GROUPNAME`, `BUDGET_CODE_OFFICER_GOOGLE_GROUPNAME`, `DATA_ADMIN_GOOGLE_GROUPNAME`, `CONTRACT_ADMIN_GOOGLE_GROUPNAME`, `FOLLOWON_ADMIN_GOOGLE_GROUPNAME` and `DLO_CONTRACTOR_GOOGLE_GROUPNAME`.

If a group setting is empty or missing, it gives nobody that role. The regexes use `$` at the end, and in a dotenv file that `$` has to be written as `\$`, because Next treats a bare `$` as a variable. In a real environment variable, such as one in CircleCI, use a plain `$`.

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

**This catches people out.** If the Service API returns one thing and your frontend code receives something different, a custom route in the Node API may be changing the data on the way through. Have a look in `src/pages/api` before you start questioning the backend.

## Authentication and user permissions

### Signing in

Sign-in uses [next-auth](https://next-auth.js.org) with Cognito, and Google sits behind Cognito. The setup is in [authOptions.ts](src/utils/auth/authOptions.ts), and the next-auth handler is `src/pages/api/auth/[...nextauth].ts`.

After a successful sign-in the session is kept in an encrypted cookie (`next-auth.session-token`). It holds the Cognito id token, which is forwarded to the backend APIs, and the user's groups. The id token itself is never sent to the browser. The session lasts 4 hours, to match the id token. There's no refresh token, so when it expires the user signs in again.

### From groups to roles

A user's permissions come from the Google groups they belong to, which Cognito passes on in the `custom:groups` claim. [cognitoGroups.ts](src/utils/auth/cognitoGroups.ts) reads that claim (an array, or a string separated by `;` or `,`), and [user.ts](src/utils/user.ts) maps the group names onto roles in Repairs Hub using the [group settings](#authentication-variables). To get the current user in a component, use the context in [UserContext](src/components/UserContext/index.js).

### Who can see what

The gate is `getInitialProps` in [`_app.tsx`](src/pages/_app.tsx), using `checkAuthorisation` from [authSession.ts](src/utils/auth/authSession.ts). There are two different outcomes:

- **Not signed in** (no valid session, or it has expired): redirected to `/login`. If it expires while someone is moving between pages, the app navigates to `/login` itself.
- **Signed in, but no role:** redirected to `/access-denied`. The same page appears when a user has a role that isn't allowed on that page.

`/login` and `/access-denied` are the only pages open to everyone.

Each page controls who can see it with a `permittedRoles` property, as you can see on the [home page](src/pages/index.js). A page with no `permittedRoles` is denied to everyone. For finer detail inside a page, like whether a certain button shows up, the logic is in [userPermissions.ts](src/utils/userPermissions.ts) and [workOrderActions.ts](src/utils/workOrderActions.ts).

There's also a [matrix of roles and page permissions](https://docs.google.com/spreadsheets/d/1mYI10Er9f-gvFKiA5bryL5PvD3KZkuK6DyKPz12bZYw/edit) if you want the overview.

### Signing out

The Sign out link goes to `/api/logout` (`src/pages/api/logout.ts`). That route closes the user's DRS session, clears the session cookies (`clearStaffSessionCookies` in [cookies.ts](src/utils/auth/cookies.ts)), and redirects to Cognito's `/logout` so the Cognito session ends too. Cognito then sends the user to `<NEXTAUTH_URL>/login`, which must be on the app client's allowed sign-out URLs. Failing to close the DRS session doesn't stop the sign-out.

## DRS Web Booking Manager flow

Some contractors get their appointments through our own calendar, and others through Hackney's scheduling software, DRS.

When a repair is raised with a POST to the `schedule` endpoint, the response can include `externallyManagedAppointment: true`. That means the job should be booked through the DRS web interface rather than our calendar.

To build a valid link into DRS, we have to generate a `sessionId` and add it to the URL as a query param. That happens in the `src/pages/api/users/schedulerSession.ts` route.

We record the user going to DRS as a Note on the work order. There's currently no other way to know they visited the external page, so the navigation itself is what we log.
