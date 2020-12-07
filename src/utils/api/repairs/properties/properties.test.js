import AuthHeader from '../../../../utils/AuthHeader'
import { getProperties, getProperty } from './properties'
import mockAxios from '../__mocks__/axios'

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

    const response = await getProperties('E9 6PT')

    expect(response).toEqual(properties)
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
    }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: property,
      })
    )

    const response = await getProperty('00012345')

    expect(response).toEqual(property)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${NEXT_PUBLIC_ENDPOINT_API}/properties/00012345`,
      {
        headers: AuthHeader(),
      }
    )
  })
})
