import cookie from 'cookie'
import { CONTRACTOR_ROLE, AGENT_ROLE } from '../../utils/user'

export const TEMPORARY_ROLE_OVERRIDE_KEY = 'repairsHubStagingRoleOverride'

// Temporary, quick way to swap roles for staging / testing
export default async (req, res) => {
  const userRoleOverride = req.query.newRole

  res.setHeader(
    'Set-Cookie',
    cookie.serialize(TEMPORARY_ROLE_OVERRIDE_KEY, userRoleOverride, {
      path: '/',
    })
  )

  res
    .status(200)
    .json(
      `You are now simulating a ${
        userRoleOverride === CONTRACTOR_ROLE ? CONTRACTOR_ROLE : AGENT_ROLE
      } role`
    )
}
