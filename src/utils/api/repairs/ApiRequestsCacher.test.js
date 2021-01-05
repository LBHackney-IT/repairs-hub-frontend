import AuthHeader from '../../../utils/AuthHeader'
import ApiRequestsCacher from './ApiRequestsCacher'
import mockAxios from '__mocks__/axios'

const { NEXT_PUBLIC_ENDPOINT_API } = process.env

describe('getProperties', () => {
  it('fetches successfully data from an API', async () => {
    const properties = [
      {
        propertyReference: '00012345',
        address: {
          shortAddress: '16 Pitcairn House  St Thomass Square',
          postalCode: 'E9 6PT',
          addressLine: '16 Pitcairn House',
          streetSuffix: 'St Thomass Square',
        },
        hierarchyType: {
          levelCode: '7',
          subTypeCode: 'DWE',
          subTypeDescription: 'Dwelling',
        },
      },
      {
        propertyReference: '00012346',
        address: {
          shortAddress: '1 Pitcairn House  St Thomass Square',
          postalCode: 'E9 6PT',
          addressLine: '1 Pitcairn House',
          streetSuffix: 'St Thomass Square',
        },
        hierarchyType: {
          levelCode: '7',
          subTypeCode: 'DWE',
          subTypeDescription: 'Dwelling',
        },
      },
    ]

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: properties,
      })
    )

    let apiCache = new ApiRequestsCacher()
    const response = await apiCache.getProperties('E9 6PT')
    expect(response).toEqual(properties)

    const cachedResponse = await apiCache.getProperties('E9 6PT')
    expect(cachedResponse).toEqual(properties)

    // axios.get should have been called only the first time, the second
    // time ApiRequestsCacher should have returned the cached response
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${NEXT_PUBLIC_ENDPOINT_API}/properties/?q=E9 6PT`,
      {
        headers: AuthHeader(),
      }
    )
  })
})

describe('getProperty', () => {
  it('fetches successfully data from an API', async () => {
    const property = {
      propertyReference: '00012345',
      address: {
        shortAddress: '16 Pitcairn House  St Thomass Square',
        postalCode: 'E9 6PT',
      },
      hierarchyType: {
        levelCode: '7',
        subTypeCode: 'DWE',
        subTypeDescription: 'Dwelling',
      },
      alerts: {
        locationAlert: [
          {
            type: 'VA',
            comments: 'Verbal Abuse or Threat of',
            startDate: '2016-07-27',
            endDate: null,
          },
        ],
        personAlert: [
          {
            type: 'CV',
            comments: 'No Lone Visits',
            startDate: '2013-03-16',
            endDate: null,
          },
        ],
      },
      tenure: {
        typeCode: 'SEC',
        typeDescription: 'Secure',
        canRaiseRepair: true,
      },
    }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: property,
      })
    )

    let apiCache = new ApiRequestsCacher()
    const response = await apiCache.getProperty('00012345')
    expect(response).toEqual(property)
    const cachedResponse = await apiCache.getProperty('00012345')
    expect(cachedResponse).toEqual(property)

    // axios.get should have been called only the first time, the second
    // time ApiRequestsCacher should have returned the cached response
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${NEXT_PUBLIC_ENDPOINT_API}/properties/00012345`,
      {
        headers: AuthHeader(),
      }
    )
  })
})
