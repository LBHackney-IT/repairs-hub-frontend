import { render } from '@testing-library/react'
import PropertyDetails from './PropertyDetails'

describe('PropertyDetails component', () => {
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
        levelCode: '7',
        subTypeCode: 'DWE',
        subTypeDescription: 'Dwelling',
      },
      cautionaryAlerts: {
        propertyReference: '00012345',
        alerts: [
          {
            alertCode: 'DIS',
            description: 'Property Under Disrepair',
            startDate: '2011-02-16',
            endDate: null,
          },
        ],
      },
    },
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <PropertyDetails
        propertyReference={props.property.propertyReference}
        address={props.property.address}
        hierarchyType={props.property.hierarchyType}
        cautionaryAlerts={props.property.cautionaryAlerts.alerts}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
