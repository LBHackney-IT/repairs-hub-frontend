import {
  getWorkOrder,
  getWorkOrders,
  getWorkOrdersForProperty,
} from './work-orders'
import mockAxios from 'axios'
import { paramsSerializer } from '../urls'

jest.mock('axios')

describe('getWorkOrder', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getWorkOrder('10000012')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/workOrders/10000012')
  })
})

describe('getWorkOrders', () => {
  it('calls the Next JS API with a status filter', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getWorkOrders(1, { StatusCode: [90, 50] })

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/workOrders/', {
      params: { PageNumber: 1, PageSize: 10, StatusCode: [90, 50] },
      paramsSerializer,
    })
  })

  it('calls the Next JS API with multiple filter parameters', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getWorkOrders(1, {
      StatusCode: [90, 50],
      Priorities: [1, 2],
      TradeCodes: ['PL'],
      ContractorReference: 'PCL',
    })

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/workOrders/', {
      params: {
        PageNumber: 1,
        PageSize: 10,
        StatusCode: [90, 50],
        Priorities: [1, 2],
        TradeCodes: ['PL'],
        ContractorReference: 'PCL',
      },
      paramsSerializer,
    })
  })
})

describe('getWorkOrdersForProperty', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getWorkOrdersForProperty('1')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/workOrders/', {
      params: {
        propertyReference: '1',
        PageSize: 50,
        PageNumber: 1,
        sort: 'dateraised:desc',
      },
    })
  })
})
