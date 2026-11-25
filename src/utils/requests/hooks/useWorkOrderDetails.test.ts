import { renderHook, waitFor } from '@testing-library/react'
import { useWorkOrderDetails } from './useWorkOrderDetails'
import { getWorkOrderDetailsRequest } from '@/requests/workOrders'
import { WorkOrder } from '@/models/workOrder'
import { APIResponseError } from '@/root/src/types/requests/types'

jest.mock('@/requests/workOrders')

const getWorkOrderDetails = getWorkOrderDetailsRequest as jest.Mock

describe('useWorkOrderDetails', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('is loading, with no work order, until the request finishes', () => {
    getWorkOrderDetails.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useWorkOrderDetails('10000040'))

    expect(result.current.workOrder).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(true)
  })

  it('requests the work order with the given reference', async () => {
    getWorkOrderDetails.mockResolvedValue({
      success: true,
      response: new WorkOrder({ reference: '10000040' }),
      error: null,
    })

    const { result } = renderHook(() => useWorkOrderDetails('10000040'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(getWorkOrderDetails).toHaveBeenCalledWith('10000040')
  })

  it('returns the work order and stops loading when the request succeeds', async () => {
    const workOrder = new WorkOrder({
      reference: '10000040',
      status: 'In Progress',
    })

    getWorkOrderDetails.mockResolvedValue({
      success: true,
      response: workOrder,
      error: null,
    })

    const { result } = renderHook(() => useWorkOrderDetails('10000040'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.workOrder).toBe(workOrder)
    expect(result.current.error).toBeNull()
  })

  it('returns the error message and stops loading when the request fails', async () => {
    getWorkOrderDetails.mockResolvedValue({
      success: false,
      response: null,
      error: new APIResponseError('Could not find a work order'),
    })

    const { result } = renderHook(() => useWorkOrderDetails('10000040'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.workOrder).toBeNull()
    expect(result.current.error).toBe('Could not find a work order')
  })
})
