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
    axios.mockResolvedValueOnce({
      data: {
        alerts: [
          {
            type: 'type1',
            comments: 'Alert 1',
          },
          {
            type: 'type2',
            comments: 'Alert 2',
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
      await waitForElementToBeRemoved([screen.getByTestId('spinner-alerts')])
    })

    expect(axios).toHaveBeenCalledTimes(1)

    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/properties/tenureId1/1/alerts',
    })

    expect(asFragment()).toMatchSnapshot()
  })

  it('accepts optional callback functions and calls them on alert fetch', async () => {
    axios.mockResolvedValueOnce({
      data: {
        alerts: [
          {
            type: 'type1',
            comments: 'Alert 1',
          },
          {
            type: 'type2',
            comments: 'Alert 2',
          },
        ],
      },
    })

    const mockSetParentAlerts = jest.fn()

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
        setParentAlerts={mockSetParentAlerts}
      />
    )

    await act(async () => {
      await waitForElementToBeRemoved([screen.getByTestId('spinner-alerts')])
    })

    expect(mockSetParentAlerts).toHaveBeenCalledWith([
      {
        type: 'type1',
        comments: 'Alert 1',
      },
      {
        type: 'type2',
        comments: 'Alert 2',
      },
    ])
  })
})
