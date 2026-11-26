import { renderHook, waitFor, act } from '@testing-library/react'
import { useWorkOrdersHistory } from './useWorkOrdersHistory'
import { getWorkOrdersHistoryRequest } from '@/requests/workOrders'
import { WorkOrder } from '@/models/workOrder'
import { APIResponseError } from '@/root/src/types/requests/types'

jest.mock('@/requests/workOrders')

const getWorkOrdersHistory = getWorkOrdersHistoryRequest as jest.Mock

const PAGE_SIZE = 50

const buildWorkOrders = (count: number, offset = 0) =>
  Array.from(
    { length: count },
    (_, i) => new WorkOrder({ reference: `${10000000 + offset + i}` })
  )

const success = (workOrders: WorkOrder[]) => ({
  success: true,
  response: workOrders,
  error: null,
})

const failure = (message: string) => ({
  success: false,
  response: null,
  error: new APIResponseError(message),
})

// A promise whose resolution the test controls
const deferred = <T>() => {
  let resolve: (value: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve: (value: T) => resolve(value) }
}

describe('useWorkOrdersHistory', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('initial load', () => {
    it('is loading, with no work orders, until the request finishes', () => {
      getWorkOrdersHistory.mockReturnValue(new Promise(() => {}))

      const { result } = renderHook(() => useWorkOrdersHistory('00012345'))

      expect(result.current.workOrders).toEqual([])
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(true)
    })

    it('requests page 1 for the given property with a page size of 50', async () => {
      getWorkOrdersHistory.mockResolvedValue(success([]))

      const { result } = renderHook(() => useWorkOrdersHistory('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(getWorkOrdersHistory).toHaveBeenCalledTimes(1)
      expect(getWorkOrdersHistory).toHaveBeenCalledWith(
        '00012345',
        1,
        PAGE_SIZE
      )
    })

    it('returns the work orders and stops loading when the request succeeds', async () => {
      const workOrders = buildWorkOrders(3)
      getWorkOrdersHistory.mockResolvedValue(success(workOrders))

      const { result } = renderHook(() => useWorkOrdersHistory('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.workOrders).toEqual(workOrders)
      expect(result.current.error).toBeNull()
    })

    it('returns the error message and stops loading when the request fails', async () => {
      getWorkOrdersHistory.mockResolvedValue(
        failure('Could not load work orders')
      )

      const { result } = renderHook(() => useWorkOrdersHistory('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.workOrders).toEqual([])
      expect(result.current.error).toBe('Could not load work orders')
    })
  })

  describe('hasMore', () => {
    it('is true when a full page is returned', async () => {
      getWorkOrdersHistory.mockResolvedValue(
        success(buildWorkOrders(PAGE_SIZE))
      )

      const { result } = renderHook(() => useWorkOrdersHistory('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.hasMore).toBe(true)
    })

    it('is false when fewer than a full page is returned', async () => {
      getWorkOrdersHistory.mockResolvedValue(
        success(buildWorkOrders(PAGE_SIZE - 1))
      )

      const { result } = renderHook(() => useWorkOrdersHistory('00012345'))

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.hasMore).toBe(false)
    })
  })

  describe('loadMore', () => {
    const firstPage = buildWorkOrders(PAGE_SIZE)
    const secondPage = buildWorkOrders(10, PAGE_SIZE)

    const renderFirstPage = async () => {
      getWorkOrdersHistory.mockResolvedValueOnce(success(firstPage))

      const hook = renderHook(() => useWorkOrdersHistory('00012345'))

      await waitFor(() => expect(hook.result.current.isLoading).toBe(false))

      return hook
    }

    it('requests the next page', async () => {
      const { result } = await renderFirstPage()
      getWorkOrdersHistory.mockResolvedValueOnce(success(secondPage))

      act(() => result.current.loadMore())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(getWorkOrdersHistory).toHaveBeenCalledTimes(2)
      expect(getWorkOrdersHistory).toHaveBeenLastCalledWith(
        '00012345',
        2,
        PAGE_SIZE
      )
    })

    it('appends the next page to the existing work orders', async () => {
      const { result } = await renderFirstPage()
      getWorkOrdersHistory.mockResolvedValueOnce(success(secondPage))

      act(() => result.current.loadMore())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.workOrders).toEqual([...firstPage, ...secondPage])
      expect(result.current.hasMore).toBe(false)
    })

    it('is loading while the next page is requested', async () => {
      const { result } = await renderFirstPage()
      getWorkOrdersHistory.mockReturnValueOnce(new Promise(() => {}))

      act(() => result.current.loadMore())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.workOrders).toEqual(firstPage)
    })

    it('keeps the existing work orders when the next page fails', async () => {
      const { result } = await renderFirstPage()
      getWorkOrdersHistory.mockResolvedValueOnce(
        failure('Could not load work orders')
      )

      act(() => result.current.loadMore())

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.workOrders).toEqual(firstPage)
      expect(result.current.error).toBe('Could not load work orders')
    })
  })

  describe('changing property reference', () => {
    it('requests work orders for the new property', async () => {
      const newPropertyWorkOrders = buildWorkOrders(2, 100)
      getWorkOrdersHistory
        .mockResolvedValueOnce(success(buildWorkOrders(2)))
        .mockResolvedValueOnce(success(newPropertyWorkOrders))

      const { result, rerender } = renderHook(
        ({ propertyReference }) => useWorkOrdersHistory(propertyReference),
        { initialProps: { propertyReference: '00012345' } }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      rerender({ propertyReference: '00067890' })

      await waitFor(() =>
        expect(result.current.workOrders).toEqual(newPropertyWorkOrders)
      )

      expect(getWorkOrdersHistory).toHaveBeenLastCalledWith(
        '00067890',
        1,
        PAGE_SIZE
      )
    })

    it('ignores a response for the previous property that resolves late', async () => {
      const previousRequest = deferred()
      const newPropertyWorkOrders = buildWorkOrders(2, 100)
      getWorkOrdersHistory
        .mockReturnValueOnce(previousRequest.promise)
        .mockResolvedValueOnce(success(newPropertyWorkOrders))

      const { result, rerender } = renderHook(
        ({ propertyReference }) => useWorkOrdersHistory(propertyReference),
        { initialProps: { propertyReference: '00012345' } }
      )

      rerender({ propertyReference: '00067890' })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        previousRequest.resolve(success(buildWorkOrders(2)))
      })

      expect(result.current.workOrders).toEqual(newPropertyWorkOrders)
    })
  })

  it('ignores a response that resolves after unmount', async () => {
    const request = deferred()
    getWorkOrdersHistory.mockReturnValue(request.promise)

    const { result, unmount } = renderHook(() =>
      useWorkOrdersHistory('00012345')
    )

    unmount()

    await act(async () => {
      request.resolve(success(buildWorkOrders(2)))
    })

    expect(result.current.workOrders).toEqual([])
    expect(result.current.isLoading).toBe(true)
  })
})
