# Manage work orders: test plan

Plan for rewriting the tests for the home page / manage work orders feature from scratch.
Nothing here is implemented yet. This is the list of *what* to test and *at which level*.

Scope: `pages/index.tsx`, `HomeView`, `WorkOrdersView`, `WorkOrdersTable`, `WorkOrderRow`,
`WorkOrdersFilterView`, `WorkOrdersFilter` (and its sub-components), plus the permission rules
that decide what the home page renders.

Out of scope for now: the operative mobile view internals (`MobileWorkingWorkOrdersView`), the
`Search` component internals, and the direct-DOM "Show all" / "Clear filters" code (separate
repair, see the last section).

---

## 1. Test levels

| Level | Tool | What it is | Network / router |
|---|---|---|---|
| **Unit** | Jest + RTL | One component or function in isolation. Children stubbed where that keeps the test focused. | none |
| **Integration** | Jest + RTL | Several *real* components wired together (e.g. `WorkOrdersView` + `WorkOrdersFilterView` + `WorkOrdersFilter` + `WorkOrdersTable`), exercised the way a user would. | `frontEndApiRequest` mocked; `next/router` replaced by a small fake (see harness) |
| **E2E** | Cypress | Real browser, real Next app, real auth cookie. API responses stubbed with `cy.intercept` fixtures. | stubbed API only |

Guidance on where a test belongs:
- A rule that depends only on props or a user object → **unit**.
- A user flow that crosses components (tick a box, press Apply, see the list change) → **integration**.
- Anything that needs the real login cookie, real routing, a real reload, `localStorage` across a
  page load, or the browser back button → **e2e**.
- Keep e2e small. It should prove the wiring, not repeat every rule.

## 2. Conventions

- **No snapshot tests.** Assert on what the user sees or what gets called.
- Select by role, label or text (`getByRole`, `getByLabelText`, `getByText`). Use `data-testid` only
  where there is no better handle (the existing `StatusCode.80`-style testids on checkboxes are fine).
- Don't assert on CSS classes such as `govuk-!-display-none` where visibility can be checked
  instead. This keeps the tests valid after the DOM-manipulation repair.
- Use the existing user factories (`factories/contractor`, `contract_manager`, `agent`,
  `authorisation_manager`, `operative`, `multiple_contractor`, and the combined ones) for every
  permission test.
- One shared filter-options fixture for Jest, mirroring `cypress/fixtures/filter/workOrder.json`
  (7 statuses, 4 priorities, 6 trades, 4 contractors) so "Show all 7" / "Show all 6" are testable.
- Test names say the behaviour: "refetches when the URL query changes", not "works".

### Integration harness (build first)

Most integration tests need the same setup, so write it once (e.g. `testUtils/renderManageWorkOrders`):
- Wrap in `UserContext.Provider` with a chosen user factory.
- Mock `frontEndApiRequest`, routing by `path` (`/api/filter/WorkOrder` vs `/api/workOrders/`) and
  recording the `params` of each work orders call.
- Fake `next/router`: `router.push({ query })` updates the `query` prop given to the page, like Next
  does after `getServerSideProps`. Without this, apply/paging flows can't be tested end to end.
- Helpers: `applyFilters()`, `tick('StatusCode.80')`, `lastWorkOrdersParams()`.

---

## 3. What to test

### 3.1 Permissions and home view routing (the key area)

The rules in `utils/userPermissions.ts`:
- `canSeeWorkOrders`: contractor, authorisation manager or contract manager permissions
- `canSeeOperativeWorkOrders`: operative permissions
- otherwise `HomeView` falls back to `Search`
- `canSeeAllFilters`: shows the "Authorisation Pending Approval" status unless the user is
  contractor-only

| Behaviour | Level | Notes |
|---|---|---|
| Role → view matrix for `HomeView`: contractor, multiple contractor, contract manager, authorisation manager, agent + contractor, auth manager + contractor, contract manager + contractor → work orders view | **Unit** | Stub the three child views and assert which one renders. Loop over the factory users. |
| Operative and one-job-at-a-time operative → mobile operative view | **Unit** | Same stubs. |
| Agent only (and other roles with no work order permission) → `Search`, with the URL `query` passed through | **Unit** | |
| `canSeeAllFilters`: contractor-only does **not** get "Authorisation Pending Approval"; every other work-order role does | **Unit** (`WorkOrdersFilter`) | Table-driven over the factories, explicit assertions on the Status options. Replaces 7 role snapshots. |
| Contractor filter box appears only when the API returns more than one contractor | **Unit** (`WorkOrdersFilter`) | This is driven by the filter *response*, not the role. Test with 1 vs several contractors. |
| Each role sees the right page for real (cookie → user → view) | **E2E** | Agent → search, contractor → list, contract manager → list with all status filters, operative → mobile view. Loop over roles in one spec instead of four copies. |
| User with no recognised role is denied | **E2E** | `authentication.cy.js` already covers this; keep or fold in. |

### 3.2 `HomeView` and the page

| Behaviour | Level |
|---|---|
| Passes `query` to the chosen view | Unit |
| Page renders `HomeView`, exposes `permittedRoles`, and `getServerSideProps` returns the query | Unit (tiny) |

### 3.3 Work orders list (`WorkOrdersView`)

| Behaviour | Level | Notes |
|---|---|---|
| Fetches page 1 with `PageSize=10`, `IncludeHistorical=false` and no filters when the URL is empty | Integration | assert on mocked request `params` |
| Passes each filter type from the URL query (`StatusCode`, `Priorities`, `TradeCodes`, `ContractorReference`) | Integration | single and multiple values |
| Shows "Manage work orders" heading while loading, plus the "Fetching work orders" spinner label | Integration | |
| Heading stays after load; list renders | Integration | |
| Request failure shows the error message and no table | Integration | |
| Refetches when the URL query changes (not just on mount) | Integration | use the fake router; this is the regression for the original reload bug |
| Does **not** remount / flash the whole view when paging or filtering | Integration | spinner shows only for the results, not the filter panel |
| Default filters from `localStorage` are used when the URL has no query | Integration | set the key before render |
| Default filters are **not** used when the URL has a query (including just `pageNumber`) | Integration | |
| No `localStorage` read during server rendering (renders spinner first, then content) | Unit | `WorkOrdersView` wrapper |

### 3.4 Pagination

| Behaviour | Level | Notes |
|---|---|---|
| Previous hidden on page 1, shown on page 2+ | Unit (`WorkOrdersTable`) | |
| Next shown only when the result count is ≥ page size | Unit (`WorkOrdersTable`) | boundary: 9, 10, 11 |
| Clicking Next/Previous calls the handler with page ±1 | Unit | |
| Clicking Next pushes `pageNumber=N+1` and keeps the applied filters in the URL, then loads that page | Integration | |
| Paging with no explicit page in URL starts from 1 | Integration | |
| Next → Previous journey, and browser back goes to the previous page | **E2E** | not covered anywhere today |

### 3.5 Table and rows (`WorkOrdersTable`, `WorkOrderRow`)

| Behaviour | Level |
|---|---|
| Column headings: Reference, Date raised, Priority, Property, Status, Trade, Description | Unit |
| A row shows reference (link to `/work-orders/:ref`), formatted date and time, priority, property, status, trade, description | Unit |
| Missing `dateRaised` shows "—" | Unit |
| Long description is truncated with "show more" / "show less" | Unit (`TruncateText`) |
| Row has the `data-ref` attribute (used by e2e) | covered by rows test |

### 3.6 Filter panel: rendering (`WorkOrdersFilter`)

| Behaviour | Level | Notes |
|---|---|---|
| Renders Status, Priority, Trade (and Contractor when applicable) boxes with the right options and labels | Unit | |
| Status labels are sentence-cased | Unit | |
| Applied filters render as checked; others unchecked | Unit | |
| Only the first 5 options are visible; "Show all N" reveals the rest and removes the link | Unit | assert on visible/in-document, not classes. Link shown only when more than 5. |
| While loading: every box shows a spinner, the Contractor box is shown, selected-filters area shows a spinner | Unit | |
| Request failed (no filters, not loading): renders nothing | Unit | |

### 3.7 Filter panel: loading and tags (`WorkOrdersFilterView`)

| Behaviour | Level |
|---|---|
| Requests `/api/filter/WorkOrder` once on mount and shows the options | Unit |
| Failure shows the error and hides the panel | Unit |
| Selected-filter tags show human descriptions ("In Progress"), grouped by category | Unit |
| Tags update when the applied filters change (not only on mount) | Unit |
| Submitting passes the ticked options to `onFilterSubmit` in the expected shape | Unit |
| Not re-fetching the filter options when the list re-fetches | Integration |

### 3.8 Applying, clearing and removing filters (integration core)

These are the flows the old Cypress `filter.cy.js` mostly checked. They belong at the integration level.

| Behaviour | Level |
|---|---|
| Tick a status, press Apply → URL gets `pageNumber=1&StatusCode=…`, list refetches with that param, tags show it | Integration |
| Multiple filters across categories are all sent | Integration |
| Unticking everything and applying removes the filters | Integration |
| Applying resets to page 1 | Integration |
| "Clear filters" empties the URL filters, unticks all boxes, refetches unfiltered, tags show "You have no selected filters" | Integration |
| Removing one tag removes only that filter (and keeps the others), refetches | Integration |
| Removing the last tag in a category | Integration |
| Deep link `/?StatusCode=80&StatusCode=90&Priorities=2` opens with those boxes ticked, tags shown and the list filtered | Integration (plus one E2E) |
| Applying then using the browser back button restores the previous filters and list | **E2E** |

### 3.9 Default filter preset (`localStorage`)

| Behaviour | Level | Notes |
|---|---|---|
| "Save selected filters as my default preset" asks for confirmation, then stores the applied filters under `RH - default work order filters` | Integration | mock `window.confirm` (accept and decline) |
| Declining the confirm stores nothing | Integration | |
| "Remove saved default filter preset" confirms, then removes the key | Integration | |
| The confirm text lists the selected filters | Integration | |
| Save → full page reload → saved filters are applied and boxes are ticked | **E2E** | needs a real reload |
| Remove → reload → list is unfiltered | **E2E** | |

### 3.10 Supporting components (small unit tests)

- `Collapsible`: opens and closes, `startClosed`, renders children.
- `FilterTag`: renders the text, remove button calls `onFilterRemove(category, index)` and prevents default.
- `Checkbox`, `Button`: keep existing tests if any, otherwise a light test.
- `utils/helpers/filter.ts` (`setFilterOptions`, `SelectedFilterOptions`) and `convertValuesOfObjectToArray`: already unit tested; keep as is.

---

## 4. E2E (Cypress) spec outline

Target: one spec (`manage-work-orders.cy.js`) of about 8 tests, replacing `home-page.cy.js` and
`work-order/index/filter.cy.js` (about 1,300 lines combined). API stubbed with the existing fixtures.

1. **Role matrix** (looped over roles): agent sees search; contractor, contract manager and
   authorisation manager see the work orders table; operative sees the mobile view.
2. **Filter options by permission**: contract manager sees all statuses incl. Authorisation
   Pending Approval; contractor does not. Multi-contractor sees the Contractor box; single does not.
3. **Happy path**: load the list, tick a filter, Apply, URL and rows update.
4. **Pagination**: Next then Previous, URL and rows update; Next hidden on the last page.
5. **Clear all and remove one tag**.
6. **Deep link** with filters in the URL opens ticked and filtered.
7. **Default preset**: save, reload, applied; remove, reload, cleared.
8. **Browser back** restores the previous filter and page.
9. **API error** shows the message.

Notes:
- The current `filter.cy.js` calls `cy.wait(['@filters', …])` again after Apply, Clear and tag
  removal. That only passed because the whole view used to remount and re-request the filters (the
  original bug). The rewrite should wait for the *work orders* alias only after the first load.
- Don't repeat per-checkbox "not checked" assertions in e2e; that is Jest's job.
- The other specs that mention "Manage work orders" (navigation, authentication, operatives,
  OJAAT) only check link visibility; leave them alone.

---

## 5. Old tests → new tests (nothing should be lost)

| Existing test | Replaced by |
|---|---|
| `WorkOrdersFilter.test.js`: 7 role snapshots | §3.1 permission-driven filter tests + §3.6 rendering tests |
| `WorkOrdersFilter.test.js`: "Show all" | §3.6 |
| `WorkOrdersFilterView.test.js` (3 tests) | §3.7 |
| `WorkOrdersTable.test.js`: snapshot | §3.4 and §3.5 |
| `home-page.cy.js`: table columns and first row, 4 roles | §3.5 (unit) + §4 test 1 |
| `home-page.cy.js`: Next/Previous absent | §3.4 |
| `filter.cy.js`: initial unchecked state, "Show all 7/6", selected-filters summary | §3.6, §3.7 |
| `filter.cy.js`: apply, deep link, clear one by one, clear all | §3.8 + §4 tests 3, 5, 6 |
| `filter.cy.js`: contractor box hidden/shown | §3.1 |
| `filter.cy.js`: save/remove preset | §3.9 + §4 test 7 |

New coverage that does not exist today: pagination clicks, error state, loading state, refetch on
query change, default preset precedence, `HomeView` role routing, browser back.

---

## 6. Related repair: direct DOM manipulation (separate PR)

"Show all" and "Clear filters" still manipulate the DOM directly. The planned fix needs a regression
test, which I reproduced earlier:

- After remounting only the checkboxes, react-hook-form v6 keeps the old inputs registered and
  returns arrays, so Apply treated **every** option as selected.
- Add an integration test: tick one status → Apply → press Apply again → only that status is sent.
- Because §3.6 and §3.8 assert on visible state rather than CSS classes, they should pass unchanged
  before and after that repair.

## 7. Suggested order

1. Build the integration harness.
2. Permissions: `HomeView` unit tests and the `WorkOrdersFilter` role table (§3.1, §3.2).
3. Integration: list, pagination, apply/clear/remove, preset (§3.3, §3.4, §3.8, §3.9).
4. Small unit tests (§3.5, §3.6, §3.7, §3.10).
5. Delete the old Jest tests and snapshots.
6. Write the single Cypress spec, then delete `home-page.cy.js` and `filter.cy.js`.

## 8. Open questions

- Should the mobile operative view and `Search` get the same treatment, or stay out of scope?
- Is Cypress runnable in CI for this branch, so the rewritten spec can be verified before merging?
- Keep any snapshot at all (e.g. one for the table), or none?
