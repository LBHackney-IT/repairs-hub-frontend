import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
} from '@/utils/helpers/priorities'
import RaiseWorkOrderForm from './RaiseWorkOrderForm'
import { agent } from 'factories/agent'
import { authorisationManager } from 'factories/authorisation_manager'
import UserContext from '@/components/UserContext'

const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('RaiseWorkOrderForm component', () => {
  axios.mockResolvedValue({
    data: {
      alerts: [],
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
      typeCode: 'SEC',
      typeDescription: 'Secure',
      tenancyAgreementReference: 'tenancyAgreementRef1',
    },
    priorities: [
      {
        priorityCode: IMMEDIATE_PRIORITY_CODE,
        description: '1 [I] IMMEDIATE',
      },
      {
        priorityCode: EMERGENCY_PRIORITY_CODE,
        description: '2 [E] EMERGENCY',
      },
      {
        priorityCode: URGENT_PRIORITY_CODE,
        description: '4 [U] URGENT',
      },
      {
        priorityCode: NORMAL_PRIORITY_CODE,
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
    contactDetails: [],
    onFormSubmit: jest.fn(),
  }

  it('should render properly', async () => {
    const { asFragment } = render(
      <UserContext.Provider value={{ user: agent }}>
        <RaiseWorkOrderForm
          propertyReference={props.property.propertyReference}
          address={props.property.address}
          hierarchyType={props.property.hierarchyType}
          canRaiseRepair={props.property.canRaiseRepair}
          tenure={props.tenure}
          priorities={props.priorities}
          trades={props.trades}
          contacts={props.contactDetails}
          onFormSubmit={props.onFormSubmit}
        />
      </UserContext.Provider>
    )

    await act(async () => {
      await waitForElementToBeRemoved([
        screen.getByTestId('spinner-locationAlerts'),
        screen.getByTestId('spinner-personAlerts'),
      ])
    })

    expect(asFragment()).toMatchSnapshot()
  })

  it('should render without possibility to choose budget code for a user without the budget code officer permission', async () => {
    const { asFragment } = render(
      <UserContext.Provider value={{ user: authorisationManager }}>
        <RaiseWorkOrderForm
          propertyReference={props.property.propertyReference}
          address={props.property.address}
          hierarchyType={props.property.hierarchyType}
          canRaiseRepair={props.property.canRaiseRepair}
          tenure={props.tenure}
          priorities={props.priorities}
          trades={props.trades}
          contacts={props.contactDetails}
          onFormSubmit={props.onFormSubmit}
        />
      </UserContext.Provider>
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
