import { act, render, screen, waitFor } from '@testing-library/react'
import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
  VOIDS_MAJOR_PRIORITY_CODE,
  VOIDS_MINOR_PRIORITY_CODE,
  PLANNED_PRIORITY_CODE,
} from '@/utils/helpers/priorities'
import RaiseWorkOrderForm from './RaiseWorkOrderForm'
import { agent } from 'factories/agent'
import { authorisationManager } from 'factories/authorisation_manager'
import UserContext from '@/components/UserContext'

import axios from 'axios'

jest.mock('axios')

describe('RaiseWorkOrderForm component', () => {
  axios.get.mockImplementation((url) => {
    if (url.includes('alert')) {
      return Promise.resolve({
        data: {
          alerts: [],
        },
      })
    }
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
    setContractors: jest.fn(),
    setBudgetCodes: jest.fn(),
    setSorCodeArrays: jest.fn(),
    setTradeCode: jest.fn(),
    setContractorReference: jest.fn(),
    setBudgetCodeId: jest.fn(),
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
          contractors={[]}
          setContractors={props.setContractors}
          budgetCodes={[]}
          setBudgetCodes={props.setBudgetCodes}
          sorCodeArrays={[[]]}
          setSorCodeArrays={props.setSorCodeArrays}
          contacts={props.contactDetails}
          onFormSubmit={props.onFormSubmit}
          tradeCode={''}
          setTradeCode={props.setTradeCode}
          contractorReference={''}
          setContractorReference={props.setContractorReference}
          budgetCodeId={''}
          setBudgetCodeId={props.setBudgetCodeId}
        />
      </UserContext.Provider>
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('spinner-propertyFlags')
      ).not.toBeInTheDocument()
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
          contractors={[]}
          setContractors={props.setContractors}
          budgetCodes={[]}
          setBudgetCodes={props.setBudgetCodes}
          sorCodeArrays={[[]]}
          setSorCodeArrays={props.setSorCodeArrays}
          contacts={props.contactDetails}
          onFormSubmit={props.onFormSubmit}
          tradeCode={''}
          setTradeCode={props.setTradeCode}
          contractorReference={''}
          setContractorReference={props.setContractorReference}
          budgetCodeId={''}
          setBudgetCodeId={props.setBudgetCodeId}
        />
      </UserContext.Provider>
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('spinner-propertyFlags')
      ).not.toBeInTheDocument()
    })

    expect(asFragment()).toMatchSnapshot()
  })

  it('should limit the priorities list to voids when H02 contract is selected', async () => {
    const prioritiesWithVoids = [
      {
        priorityCode: IMMEDIATE_PRIORITY_CODE,
        description: '[I] IMMEDIATE',
      },
      {
        priorityCode: EMERGENCY_PRIORITY_CODE,
        description: '[E] EMERGENCY',
      },
      {
        priorityCode: URGENT_PRIORITY_CODE,
        description: '[U] URGENT',
      },
      {
        priorityCode: NORMAL_PRIORITY_CODE,
        description: '[N] NORMAL',
      },
      {
        priorityCode: VOIDS_MAJOR_PRIORITY_CODE,
        description: '[V15] VOIDS MINOR',
      },
      {
        priorityCode: VOIDS_MINOR_PRIORITY_CODE,
        description: '[V30] VOIDS MAJOR',
      },
      {
        priorityCode: PLANNED_PRIORITY_CODE,
        description: '[P] PLANNED',
      },
    ]

    const { asFragment } = render(
      <UserContext.Provider value={{ user: agent }}>
        <RaiseWorkOrderForm
          propertyReference={props.property.propertyReference}
          address={props.property.address}
          hierarchyType={props.property.hierarchyType}
          canRaiseRepair={props.property.canRaiseRepair}
          tenure={props.tenure}
          priorities={prioritiesWithVoids}
          trades={props.trades}
          contractors={[]}
          setContractors={props.setContractors}
          budgetCodes={[]}
          setBudgetCodes={props.setBudgetCodes}
          sorCodeArrays={[[]]}
          setSorCodeArrays={props.setSorCodeArrays}
          contacts={props.contactDetails}
          onFormSubmit={props.onFormSubmit}
          tradeCode={''}
          setTradeCode={props.setTradeCode}
          contractorReference={'h02'}
          setContractorReference={props.setContractorReference}
          budgetCodeId={''}
          setBudgetCodeId={props.setBudgetCodeId}
        />
      </UserContext.Provider>
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('spinner-propertyFlags')
      ).not.toBeInTheDocument()
    })

    expect(asFragment()).toMatchSnapshot()
  })
})
