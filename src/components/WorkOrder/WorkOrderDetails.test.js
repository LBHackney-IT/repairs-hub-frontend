import { render } from '@testing-library/react'
import WorkOrderDetails from './WorkOrderDetails'

describe('WorkOrderDetails component', () => {
  const props = {
    workOrder: {
      reference: 10000012,
      dateRaised: '2021-01-18T15:28:57.17811',
      lastUpdated: null,
      priority: 'U - Urgent (5 Working days)',
      property: '',
      owner: '',
      description: 'This is an urgent repair description',
      propertyReference: '00014888',
    },
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
          alertCode: 'DIS',
          description: 'Property Under Disrepair',
          startDate: '2011-02-16',
          endDate: null,
        },
      ],
      personAlert: [
        {
          alertCode: 'DIS',
          description: 'Property Under Disrepair',
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
      <WorkOrderDetails
        propertyReference={props.property.propertyReference}
        workOrder={props.workOrder}
        address={props.property.address}
        subTypeDescription={props.property.hierarchyType.subTypeDescription}
        tenure={props.tenure}
        locationAlerts={props.alerts.locationAlert}
        personAlerts={props.alerts.personAlert}
        hasLinkToProperty={true}
        canRaiseRepair={props.property.canRaiseRepair}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
