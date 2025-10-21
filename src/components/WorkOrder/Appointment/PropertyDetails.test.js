import { render, screen } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'

import PropertyDetails from './PropertyDetails'
const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('PropertyDetails component', () => {
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

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-undefined')).not.toBeInTheDocument()
    })

    expect(asFragment()).toMatchSnapshot()
  })
})
