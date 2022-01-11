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
        subTypeDescription: 'Dwelling',
      },
      canRaiseRepair: true,
    },
    alerts: {
      locationAlert: [
        {
          type: 'DIS',
          comments: 'Property Under Disrepair',
          startDate: '2011-02-16',
          endDate: null,
        },
      ],
      personAlert: [
        {
          type: 'DIS',
          comments: 'Property Under Disrepair',
          startDate: '2011-08-16',
          endDate: null,
        },
      ],
    },
    tenure: {
      typeCode: 'SEC',
      typeDescription: 'Secure',
    },
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <PropertyDetails
        address={props.property.address}
        tenure={props.tenure}
        subTypeDescription={props.property.hierarchyType.subTypeDescription}
        locationAlerts={props.alerts.locationAlert}
        personAlerts={props.alerts.personAlert}
        canRaiseRepair={props.property.canRaiseRepair}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
