import { renderHook, waitFor } from '@testing-library/react'
import { useSimpleFeatureToggles } from './useSimpleFeatureToggle'
import { fetchSimpleFeatureTogglesRequest } from '@/requests/featureToggles'

jest.mock('@/requests/featureToggles')

const fetchToggles = fetchSimpleFeatureTogglesRequest as jest.Mock

const TOGGLES = {
  googleTagManagerEnabled: true,
  enableFollowOnIsEmergencyField: false,
  enableAwaabsLawReasonForRepair: true,
  enableHealthAndSafetyFlag: false,
  enableCompletionApprovalStep: true,
}

describe('useSimpleFeatureToggles', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('is loading, with no toggles, until the request finishes', async () => {
    fetchToggles.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useSimpleFeatureToggles())

    const [toggles, isLoading, error] = result.current

    expect(toggles).toBeUndefined()
    expect(isLoading).toBe(true)
    expect(error).toBeNull()
  })

  it('returns the fetched toggles and stops loading', async () => {
    fetchToggles.mockResolvedValue(TOGGLES)

    const { result } = renderHook(() => useSimpleFeatureToggles())

    await waitFor(() => expect(result.current[1]).toBe(false))

    expect(result.current[0]).toEqual(TOGGLES)
    expect(result.current[2]).toBeNull()
  })

  it('stops loading, without toggles, and returns and logs the error when the request fails', async () => {
    const error = new Error('Network error')
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    fetchToggles.mockRejectedValue(error)

    const { result } = renderHook(() => useSimpleFeatureToggles())

    await waitFor(() => expect(result.current[1]).toBe(false))

    expect(result.current[0]).toBeUndefined()
    expect(result.current[2]).toBe(error)
    expect(consoleError).toHaveBeenCalledWith(
      'failed to fetch feature toggles',
      error
    )

    consoleError.mockRestore()
  })

  it('only fetches the toggles once, even when re-rendered', async () => {
    fetchToggles.mockResolvedValue(TOGGLES)

    const { result, rerender } = renderHook(() => useSimpleFeatureToggles())

    await waitFor(() => expect(result.current[1]).toBe(false))

    rerender()

    expect(fetchToggles).toHaveBeenCalledTimes(1)
  })
})
