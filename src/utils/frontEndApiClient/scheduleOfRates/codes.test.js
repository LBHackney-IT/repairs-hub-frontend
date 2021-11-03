import { getSorCodes, getSorCode } from './codes'
import mockAxios from 'axios'

jest.mock('axios')

describe('getSorCodes`', () => {
  it('calls the Next JS API', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getSorCodes('PL', '00001234', 'H01')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/schedule-of-rates/codes', {
      params: {
        contractorReference: 'H01',
        propertyReference: '00001234',
        tradeCode: 'PL',
        isRaisable: false,
      },
    })
  })

  it('calls the Next JS API with isRaisable: true params', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getSorCodes('PL', '00001234', 'H01', true)

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/api/schedule-of-rates/codes', {
      params: {
        contractorReference: 'H01',
        propertyReference: '00001234',
        tradeCode: 'PL',
        isRaisable: true,
      },
    })
  })
})

describe('getSorCode`', () => {
  it('calls the Next JS API with a contractor reference', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getSorCode('PLP5R082', '00001234', 'PCL')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/schedule-of-rates/codes/PLP5R082',
      {
        params: {
          propertyReference: '00001234',
          contractorReference: 'PCL',
        },
      }
    )
  })

  it('calls the Next JS API without a contractor reference', async () => {
    const responseData = { data: 'test' }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: responseData,
      })
    )

    const response = await getSorCode('PLP5R082', '00001234')

    expect(response).toEqual(responseData)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/schedule-of-rates/codes/PLP5R082',
      {
        params: {
          propertyReference: '00001234',
        },
      }
    )
  })
})
