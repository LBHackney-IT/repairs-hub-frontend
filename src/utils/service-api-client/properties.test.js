import { getProperties, getProperty } from './properties'
import mockAxios from '../__mocks__/axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_KEY } = process.env

const headers = { 'x-api-key': REPAIRS_SERVICE_API_KEY }

describe('repairs APIs', () => {
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

      const data = await getProperties({ q: 'E9 6PT' })

      expect(data).toEqual(properties)

      expect(mockAxios.get).toHaveBeenCalledTimes(1)
      expect(mockAxios.get).toHaveBeenCalledWith(
        `${REPAIRS_SERVICE_API_URL}/properties`,
        {
          params: { q: 'E9 6PT' },
          headers,
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

      const data = await getProperty('00012345')

      expect(data).toEqual(property)

      expect(mockAxios.get).toHaveBeenCalledTimes(1)
      expect(mockAxios.get).toHaveBeenCalledWith(
        `${REPAIRS_SERVICE_API_URL}/properties/00012345`,
        {
          headers,
        }
      )
    })
  })
})
