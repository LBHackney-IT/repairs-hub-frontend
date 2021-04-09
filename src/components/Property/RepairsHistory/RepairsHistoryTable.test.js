import { render } from '@testing-library/react'
import UserContext from '../../UserContext/UserContext'
import RepairsHistoryTable from './RepairsHistoryTable'

describe('RepairsHistoryTable component', () => {
  const props = {
    tabName: 'Repairs history',
    workOrders: [
      {
        reference: 10000012,
        dateRaised: new Date('2021-01-18T15:28:57.17811'),
        lastUpdated: null,
        priority: '1 [I] IMMEDIATE',
        property: '16 Pitcairn House  St Thomass Square',
        owner: '',
        tradeDescription: 'DOOR ENTRY ENGINEER - DE',
        description: 'This is an immediate repair description',
        propertyReference: '00012345',
        status: 'In progress',
      },
      {
        reference: 10000013,
        dateRaised: new Date('2021-01-23T16:28:57.17811'),
        lastUpdated: null,
        priority: '4 [U] URGENT',
        property: '16 Pitcairn House  St Thomass Square',
        owner: '',
        tradeDescription: 'DOOR ENTRY ENGINEER - DE',
        description: 'This is an urgent repair description',
        propertyReference: '00012345',
        status: 'In progress',
      },
    ],
  }

  describe('when logged in as an agent', () => {
    const user = {
      name: 'An Agent',
      email: 'an.agent@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: true,
      hasContractorPermissions: false,
      hasContractManagerPermissions: false,
      hasAnyPermissions: true,
    }

    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <RepairsHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contractor', () => {
    const user = {
      name: 'A Contractor',
      email: 'a.contractor@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: true,
      hasContractManagerPermissions: false,
      hasAnyPermissions: true,
    }

    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <RepairsHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contract manager', () => {
    const user = {
      name: 'A Contractor',
      email: 'a.contractor@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: false,
      hasContractManagerPermissions: true,
      hasAnyPermissions: true,
    }

    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <RepairsHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
