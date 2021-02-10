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
    sorCodes: [
      {
        customCode: 'DES5R003',
        customName: 'Immediate call outs',
        priority: {
          priorityCode: 1,
          description: 'I - Immediate (2 hours)',
        },
        sorContractor: {
          reference: 'H01',
        },
      },
      {
        customCode: 'DES5R004',
        customName: 'Emergency call outs',
        priority: {
          priorityCode: 2,
          description: 'E - Emergency (24 hours)',
        },
        sorContractor: {
          reference: 'H01',
        },
      },
    ],
    priorities: [
      {
        priorityCode: 1,
        description: 'I - Immediate (2 hours)',
      },
      {
        priorityCode: 2,
        description: 'E - Emergency (24 hours)',
      },
      {
        priorityCode: 3,
        description: 'U - Urgent 7 days (5 Working days)',
      },
      {
        priorityCode: 4,
        description: 'N - Normal 28 days (21 working days)',
      },
      {
        priorityCode: 5,
        description: 'Inspection',
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
        sorCodes={props.sorCodes}
        priorities={props.priorities}
        onFormSubmit={props.onFormSubmit}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
