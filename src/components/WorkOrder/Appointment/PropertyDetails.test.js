import {
  render,
  act,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react'
import PropertyDetails from './PropertyDetails'
const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('PropertyDetails component', () => {
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

  const props = {
    property: {
      propertyReference: '00012345',
      address: {
        shortAddress: '16 Pitcairn House  St Thomass Square',
        postalCode: 'E9 6PT',
        addressLine: '16 Pitcairn House',
        streetSuffix: 'St Thomass Square',
      },
      hierarchyType: {
        subTypeDescription: 'Dwelling',
      },
      canRaiseRepair: true,
    },
    tenure: {
      id: 'tenureId1',
      typeCode: 'SEC',
      typeDescription: 'Secure',
      tenancyAgreementReference: 'tenancyAgreementRef1',
    },
  }

  it('should render properly', async () => {
    const { asFragment } = render(
      <PropertyDetails
        propertyReference={props.property.propertyReference}
        address={props.property.address}
        tenure={props.tenure}
        subTypeDescription={props.property.hierarchyType.subTypeDescription}
        canRaiseRepair={props.property.canRaiseRepair}
      />
    )

    await act(async () => {
      await waitForElementToBeRemoved([
        screen.getByTestId('spinner-locationAlerts'),
        screen.getByTestId('spinner-personAlerts'),
      ])
    })

    expect(asFragment()).toMatchSnapshot()
  })
})
