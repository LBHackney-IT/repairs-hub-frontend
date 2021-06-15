import { render } from '@testing-library/react'
import UserContext from '../../UserContext/UserContext'
import WorkOrdersFilter from './WorkOrdersFilter'
import { contractor } from 'factories/contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'
import { multipleContractor } from 'factories/multiple_contractor'

describe('WorkOrdersFilter component', () => {
  const props = {
    filters: {
      Priority: [
        {
          key: 'I',
          description: 'Immediate',
        },
        {
          key: 'E',
          description: 'Emergency',
        },
      ],
      Status: [
        {
          key: '80',
          description: 'In Progress',
        },
        {
          key: '50',
          description: 'Complete',
        },
        {
          key: '30',
          description: 'Work Cancelled',
        },
        {
          key: '1010',
          description: 'Authorisation Pending Approval',
        },
        {
          key: '90',
          description: 'Variation Pending Approval',
        },
        {
          key: '1080',
          description: 'Variation Approved',
        },
        {
          key: '1090',
          description: 'Variation Rejected',
        },
      ],
      Trades: [
        {
          key: 'DE',
          description: 'DOOR ENTRY ENGINEER',
        },
        {
          key: 'EL',
          description: 'Electrical',
        },
        {
          key: 'GL',
          description: 'Glazing',
        },
        {
          key: 'PL',
          description: 'Plumbing',
        },
      ],
      Contractors: [
        {
          key: 'AVP',
          description: 'Avonline Network (A) Ltd',
        },
        {
          key: 'PCL',
          description: 'Purdy Contracts (P) Ltd',
        },
        {
          key: 'SCC',
          description: 'Alphatrack (S) Systems Lt',
        },
      ],
    },
    loading: false,
    register: jest.fn(),
    clearFilters: jest.fn(),
  }

  describe('when logged in as a contractor with more than one contractor role', () => {
    it('should render properly with filter by contractor (only groups they belong to) and no authorisation pending approval status', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: multipleContractor }}>
          <WorkOrdersFilter
            filters={props.filters}
            loading={props.loading}
            register={props.register}
            clearFilters={props.clearFilters}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contract manager', () => {
    it('should render properly with all filter options', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractManager }}>
          <WorkOrdersFilter
            filters={props.filters}
            loading={props.loading}
            register={props.register}
            clearFilters={props.clearFilters}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as an authorisation manager', () => {
    it('should render properly with all filter options', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: authorisationManager }}>
          <WorkOrdersFilter
            filters={props.filters}
            loading={props.loading}
            register={props.register}
            clearFilters={props.clearFilters}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contractor with one contractor role', () => {
    it('should render properly without filter by contractor and no authorisation pending approval status', () => {
      // Return one contractor option
      props.filters.Contractors = [
        {
          key: 'AVP',
          description: 'Avonline Network (A) Ltd',
        },
      ]

      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractor }}>
          <WorkOrdersFilter
            filters={props.filters}
            loading={props.loading}
            register={props.register}
            clearFilters={props.clearFilters}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
