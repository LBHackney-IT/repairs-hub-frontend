import { render } from '@testing-library/react'
import UserContext from '../../UserContext'
import WorkOrdersHistoryTable from './WorkOrdersHistoryTable'
import { agent } from 'factories/agent'
import { contractor } from 'factories/contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'

describe('WorkOrdersHistoryTable component', () => {
  const props = {
    tabName: 'Work orders history',
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
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrdersHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
            pageSize={1}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contractor', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractor }}>
          <WorkOrdersHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
            pageSize={1}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contract manager', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractManager }}>
          <WorkOrdersHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
            pageSize={1}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as an authorisation manager', () => {
    it('should render properly', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: authorisationManager }}>
          <WorkOrdersHistoryTable
            workOrders={props.workOrders}
            tabName={props.tabName}
            pageSize={1}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
