import { render } from '@testing-library/react'
import RaiseRepairForm from './RaiseRepairForm'

describe('RaiseRepairForm component', () => {
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
    priorities: [
      {
        priorityCode: 1,
        description: '1 [I] IMMEDIATE',
      },
      {
        priorityCode: 2,
        description: '2 [E] EMERGENCY',
      },
      {
        priorityCode: 3,
        description: '4 [U] URGENT',
      },
      {
        priorityCode: 4,
        description: '5 [N] NORMAL',
      },
    ],
    trades: [
      {
        code: 'DE',
        name: 'DOOR ENTRY ENGINEER',
      },
      {
        code: 'PL',
        name: 'Plumbing',
      },
    ],
    onFormSubmit: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <RaiseRepairForm
        propertyReference={props.property.propertyReference}
        address={props.property.address}
        hierarchyType={props.property.hierarchyType}
        canRaiseRepair={props.property.canRaiseRepair}
        tenure={props.tenure}
        locationAlerts={props.alerts.locationAlert}
        personAlerts={props.alerts.personAlert}
        priorities={props.priorities}
        trades={props.trades}
        onFormSubmit={props.onFormSubmit}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
