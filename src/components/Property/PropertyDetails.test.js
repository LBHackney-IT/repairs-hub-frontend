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

  it('should render properly', async () => {
    const { asFragment } = render(
      <PropertyDetails
        propertyReference={props.property.propertyReference}
        address={props.property.address}
        hierarchyType={props.property.hierarchyType}
        canRaiseRepair={props.property.canRaiseRepair}
        tenure={props.tenure}
        locationAlerts={props.alerts.locationAlert}
        personAlerts={props.alerts.personAlert}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
