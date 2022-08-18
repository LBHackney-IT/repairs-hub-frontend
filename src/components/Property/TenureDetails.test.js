import {
  render,
  act,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import TenureDetails from './TenureDetails'

const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('TenureDetails', () => {
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
      
    const { asFragment } = render(
      <TenureDetails
        canRaiseRepair={true}
        tenure={{
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
        screen.getByTestId('spinner-cautionaryAlerts'),
      ])
    })

    expect(axios).toHaveBeenCalledTimes(1)

    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/properties/1/location-alerts',
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

    const mockSetParentCautionaryAlerts = jest.fn()

    render(
      <TenureDetails
        canRaiseRepair={true}
        tenure={{
          tenancyAgreementReference: 'tenancyAgreementRef1',
          typeCode: 'tenancyTypeCode',
          typeDescription: 'tenancyTypeDescription',
        }}
        propertyReference={'1'}
        setParentCautionaryAlerts={mockSetParentCautionaryAlerts}
      />
    )

    await act(async () => {
      await waitForElementToBeRemoved([
        screen.getByTestId('spinner-cautionaryAlerts'),
      ])
    })

    expect(mockSetParentCautionaryAlerts).toHaveBeenCalledWith([
      {
        type: 'type1',
        comments: 'Location Alert 1',
      },
      {
        type: 'type2',
        comments: 'Location Alert 2',
      },
    ])
  })
})
