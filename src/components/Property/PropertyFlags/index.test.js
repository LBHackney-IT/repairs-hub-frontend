import {
  render,
  act,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import PropertyFlags from '.'

const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('PropertyFlags', () => {
  it('should render tenure and alerts', async () => {
    axios
      .mockResolvedValueOnce({
        data: {
          alerts: [
            {
              type: 'type1',
              comments: 'Location Alert 1',
            },
            {
              type: 'type2',
              comments: 'Location Alert 2',
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          alerts: [
            {
              type: 'type3',
              comments: 'Person Alert 1',
            },
            {
              type: 'type4',
              comments: 'Person Alert 2',
            },
          ],
        },
      })

    const { asFragment } = render(
      <PropertyFlags
        canRaiseRepair={true}
        boilerHouseId=""
        tenure={{
          id: 'tenureId1',
          tenancyAgreementReference: 'tenancyAgreementRef1',
          typeCode: 'tenancyTypeCode',
          typeDescription: 'tenancyTypeDescription',
        }}
        propertyReference={'1'}
        tmoName={'tmoName'}
      />
    )

    expect(asFragment()).toMatchSnapshot()

    await act(async () => {
      await waitForElementToBeRemoved([
        screen.getByTestId('spinner-locationAlerts'),
        screen.getByTestId('spinner-personAlerts'),
      ])
    })

    expect(axios).toHaveBeenCalledTimes(2)

    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/properties/1/location-alerts',
    })

    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/properties/tenureId1/person-alerts',
    })

    expect(asFragment()).toMatchSnapshot()
  })

  it('accepts optional callback functions and calls them on alert fetch', async () => {
    axios
      .mockResolvedValueOnce({
        data: {
          alerts: [
            {
              type: 'type1',
              comments: 'Location Alert 1',
            },
            {
              type: 'type2',
              comments: 'Location Alert 2',
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          alerts: [
            {
              type: 'type3',
              comments: 'Person Alert 1',
            },
            {
              type: 'type4',
              comments: 'Person Alert 2',
            },
          ],
        },
      })

    const mockSetParentLocationAlerts = jest.fn()
    const mockSetParentPersonAlerts = jest.fn()

    render(
      <PropertyFlags
        canRaiseRepair={true}
        boilerHouseId=""
        tenure={{
          id: 'tenureId1',
          tenancyAgreementReference: 'tenancyAgreementRef1',
          typeCode: 'tenancyTypeCode',
          typeDescription: 'tenancyTypeDescription',
        }}
        propertyReference={'1'}
        setParentLocationAlerts={mockSetParentLocationAlerts}
        setParentPersonAlerts={mockSetParentPersonAlerts}
      />
    )

    await act(async () => {
      await waitForElementToBeRemoved([
        screen.getByTestId('spinner-locationAlerts'),
        screen.getByTestId('spinner-personAlerts'),
      ])
    })

    expect(mockSetParentLocationAlerts).toHaveBeenCalledWith([
      {
        type: 'type1',
        comments: 'Location Alert 1',
      },
      {
        type: 'type2',
        comments: 'Location Alert 2',
      },
    ])

    expect(mockSetParentPersonAlerts).toHaveBeenCalledWith([
      {
        type: 'type3',
        comments: 'Person Alert 1',
      },
      {
        type: 'type4',
        comments: 'Person Alert 2',
      },
    ])
  })
})
