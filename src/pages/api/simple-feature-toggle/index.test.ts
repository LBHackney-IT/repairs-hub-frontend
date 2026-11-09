/** @jest-environment node */
import { authorisedRouteRequest } from 'factories/api_route'

import featureToggleEndpoint from './index'

describe('GET /api/simple-feature-toggle', () => {
  const originalEnv = { ...process.env }

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('reports the toggles from the environment', async () => {
    process.env.TAG_MANAGER_ID = 'GTM-TEST'
    process.env.FOLLOW_ON_IS_EMERGENCY_FIELD_ENABLED = 'true'
    process.env.ENABLE_AWAABS_LAW_REASON_FOR_REPAIR = 'true'
    process.env.ENABLE_HEALTH_AND_SAFETY_FLAG = 'true'

    const { req, res } = await authorisedRouteRequest({ method: 'GET' })

    await featureToggleEndpoint(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual({
      googleTagManagerEnabled: true,
      enableFollowOnIsEmergencyField: true,
      enableAwaabsLawReasonForRepair: true,
      enableHealthAndSafetyFlag: true,
    })
  })

  it('reports every toggle off when the environment is not set', async () => {
    delete process.env.TAG_MANAGER_ID
    delete process.env.FOLLOW_ON_IS_EMERGENCY_FIELD_ENABLED
    delete process.env.ENABLE_AWAABS_LAW_REASON_FOR_REPAIR
    delete process.env.ENABLE_HEALTH_AND_SAFETY_FLAG

    const { req, res } = await authorisedRouteRequest({ method: 'GET' })

    await featureToggleEndpoint(req, res)

    expect(JSON.parse(res._getData())).toEqual({
      googleTagManagerEnabled: false,
      enableFollowOnIsEmergencyField: false,
      enableAwaabsLawReasonForRepair: false,
      enableHealthAndSafetyFlag: false,
    })
  })
})
