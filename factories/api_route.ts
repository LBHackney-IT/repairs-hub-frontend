import { createRequest, createResponse } from 'node-mocks-http'
import type { RequestOptions } from 'node-mocks-http'
import { signSessionCookie } from './session_cookie'

export const TEST_GROUPS = {
  agent: 'test-agents',
  authorisationManager: 'test-authorisation-managers',
  contractor: 'test-contractors-acme',
}

// buildUser reads these when it's called, so the route tests don't depend on a
// developer's .env.test.local. Set when a request is built, never when this file
// is imported: Next builds the *.test.ts files under pages/api as routes, so
// anything that runs on import would run inside the app.
const useTestGroups = () => {
  Object.assign(process.env, {
    AGENTS_GOOGLE_GROUPNAME_REGEX: `^${TEST_GROUPS.agent}$`,
    CONTRACTORS_GOOGLE_GROUPNAME_REGEX: '^test-contractors-',
    AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME: TEST_GROUPS.authorisationManager,
  })
}

// A request to an API route from a signed-in user, plus the headers the route
// should send upstream (the user's Cognito id token and the API key)
export const authorisedRouteRequest = async (
  requestOptions: RequestOptions = {},
  group: string = TEST_GROUPS.agent
) => {
  useTestGroups()

  const session = await signSessionCookie({ groups: [group] })

  return {
    req: createRequest({ ...session.requestOptions, ...requestOptions }),
    res: createResponse(),
    upstreamHeaders: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REPAIRS_SERVICE_API_KEY,
      'x-hackney-user': session.idToken,
      Authorization: session.idToken,
    },
  }
}
