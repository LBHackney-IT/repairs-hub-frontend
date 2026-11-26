import { renderHook, waitFor } from '@testing-library/react'
import { useCautionaryAlerts } from './useCautionaryAlerts'
import { getCautionaryAlertsRequest } from '@/requests/property'
import { CautionaryAlert } from '@/models/cautionaryAlerts'
import { APIResponseError } from '@/root/src/types/requests/types'

jest.mock('@/requests/property')

const getCautionaryAlerts = getCautionaryAlertsRequest as jest.Mock

const alerts: CautionaryAlert[] = [
  {
    type: 'VA',
    comments: 'Verbal abuse',
    startDate: '2024-01-01',
    endDate: null,
  },
  {
    type: 'DOG',
    comments: 'Dog on premises',
    startDate: '2024-02-01',
    endDate: null,
  },
]

describe('useCautionaryAlerts', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('without a property reference', () => {
    it('does not make a request', () => {
      renderHook(() => useCautionaryAlerts(undefined))

      expect(getCautionaryAlerts).not.toHaveBeenCalled()
    })

    it('is not loading and has no alerts', () => {
      const { result } = renderHook(() => useCautionaryAlerts(undefined))

      expect(result.current.alerts).toEqual([])
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('with a property reference', () => {
    it('is loading, with no alerts, until the request finishes', () => {
      getCautionaryAlerts.mockReturnValue(new Promise(() => {}))

      const { result } = renderHook(() => useCautionaryAlerts('00012345'))

      expect(result.current.alerts).toEqual([])
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(true)
    })

    it('requests the alerts for the given property', async () => {
      getCautionaryAlerts.mockResolvedValue({
        success: true,
        response: { reference: '00012345', alerts: [] },
        error: null,
      })

      const { result } = renderHook(() => useCautionaryAlerts('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(getCautionaryAlerts).toHaveBeenCalledTimes(1)
      expect(getCautionaryAlerts).toHaveBeenCalledWith('00012345')
    })

    it('returns the alerts when the request succeeds', async () => {
      getCautionaryAlerts.mockResolvedValue({
        success: true,
        response: { reference: '00012345', alerts },
        error: null,
      })

      const { result } = renderHook(() => useCautionaryAlerts('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.alerts).toEqual(alerts)
      expect(result.current.error).toBeNull()
    })

    it('returns no alerts when the property has none', async () => {
      getCautionaryAlerts.mockResolvedValue({
        success: true,
        response: { reference: '00012345', alerts: [] },
        error: null,
      })

      const { result } = renderHook(() => useCautionaryAlerts('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.alerts).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('returns the error message, with no alerts, when the request fails', async () => {
      getCautionaryAlerts.mockResolvedValue({
        success: false,
        response: null,
        error: new APIResponseError('Could not get cautionary alerts'),
      })

      const { result } = renderHook(() => useCautionaryAlerts('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.alerts).toEqual([])
      expect(result.current.error).toBe('Could not get cautionary alerts')
    })
  })

  it('makes the request once the property reference becomes available', async () => {
    getCautionaryAlerts.mockResolvedValue({
      success: true,
      response: { reference: '00012345', alerts },
      error: null,
    })

    const { result, rerender } = renderHook(
      ({ propertyReference }) => useCautionaryAlerts(propertyReference),
      { initialProps: { propertyReference: undefined as string | undefined } }
    )

    expect(getCautionaryAlerts).not.toHaveBeenCalled()

    rerender({ propertyReference: '00012345' })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(getCautionaryAlerts).toHaveBeenCalledWith('00012345')
    expect(result.current.alerts).toEqual(alerts)
  })
})
