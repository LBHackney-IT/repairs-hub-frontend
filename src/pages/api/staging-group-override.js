import cookie from 'cookie'

export const TEMPORARY_GROUP_OVERRIDE_KEY = 'repairsHubStagingGroupOverride'

// Temporary, quick way to swap groups for staging / testing
// TODO: Delete this once we're happy with Google log ins
const endpoint = async (req, res) => {
  const userGroupOverride = req.query.newGroup

  res.setHeader(
    'Set-Cookie',
    cookie.serialize(TEMPORARY_GROUP_OVERRIDE_KEY, userGroupOverride, {
      path: '/',
    })
  )

  res.status(200).json(`You have set the ${userGroupOverride} group`)
}

export default endpoint
