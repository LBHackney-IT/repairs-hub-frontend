import { renderHook, waitFor } from '@testing-library/react'
import { useLegalDisrepairStatus } from './useLegalDisrepairStatus'
import { getLegalDisrepairStatusRequest } from '@/requests/property'
import { APIResponseError } from '@/root/src/types/requests/types'

jest.mock('@/requests/property')

const getLegalDisrepairStatus = getLegalDisrepairStatusRequest as jest.Mock

describe('useLegalDisrepairStatus', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('without a property reference', () => {
    it('does not make a request', () => {
      renderHook(() => useLegalDisrepairStatus(undefined))

      expect(getLegalDisrepairStatus).not.toHaveBeenCalled()
    })

    it('is not loading and has no status', () => {
      const { result } = renderHook(() => useLegalDisrepairStatus(undefined))

      expect(result.current.isInLegalDisrepair).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('with a property reference', () => {
    it('is loading, with no status, until the request finishes', () => {
      getLegalDisrepairStatus.mockReturnValue(new Promise(() => {}))

      const { result } = renderHook(() => useLegalDisrepairStatus('00012345'))

      expect(result.current.isInLegalDisrepair).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(true)
    })

    it('requests the status for the given property', async () => {
      getLegalDisrepairStatus.mockResolvedValue({
        success: true,
        response: { propertyIsInLegalDisrepair: false },
        error: null,
      })

      const { result } = renderHook(() => useLegalDisrepairStatus('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(getLegalDisrepairStatus).toHaveBeenCalledTimes(1)
      expect(getLegalDisrepairStatus).toHaveBeenCalledWith('00012345')
    })

    it.each([true, false])(
      'returns the legal disrepair status from the response (%s)',
      async (status) => {
        getLegalDisrepairStatus.mockResolvedValue({
          success: true,
          response: { propertyIsInLegalDisrepair: status },
          error: null,
        })

        const { result } = renderHook(() => useLegalDisrepairStatus('00012345'))

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.isInLegalDisrepair).toBe(status)
        expect(result.current.error).toBeNull()
      }
    )

    it('returns the error message, with no status, when the request fails', async () => {
      getLegalDisrepairStatus.mockResolvedValue({
        success: false,
        response: null,
        error: new APIResponseError('Could not get legal disrepair status'),
      })

      const { result } = renderHook(() => useLegalDisrepairStatus('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isInLegalDisrepair).toBeNull()
      expect(result.current.error).toBe('Could not get legal disrepair status')
    })
  })

  it('makes the request once the property reference becomes available', async () => {
    getLegalDisrepairStatus.mockResolvedValue({
      success: true,
      response: { propertyIsInLegalDisrepair: true },
      error: null,
    })

    const { result, rerender } = renderHook(
      ({ propertyReference }) => useLegalDisrepairStatus(propertyReference),
      { initialProps: { propertyReference: undefined as string | undefined } }
    )

    expect(getLegalDisrepairStatus).not.toHaveBeenCalled()

    rerender({ propertyReference: '00012345' })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(getLegalDisrepairStatus).toHaveBeenCalledWith('00012345')
    expect(result.current.isInLegalDisrepair).toBe(true)
  })
})
