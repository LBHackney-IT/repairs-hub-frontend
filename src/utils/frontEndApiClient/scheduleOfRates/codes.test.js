import { getSorCode } from './codes'
import mockAxios from 'axios'

jest.mock('axios')

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
