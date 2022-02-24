import { render } from '@testing-library/react'
import UserContext from '../../UserContext'
import WorkOrdersFilter from './WorkOrdersFilter'
import { contractor } from 'factories/contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'
import { multipleContractor } from 'factories/multiple_contractor'
import { agentAndContractor } from 'factories/agent_and_contractor'
import { authorisationManagerAndContractor } from 'factories/authorisation_manager_and_contractor'
import { contractManagerAndContractor } from 'factories/authorisation_manager_and_contractor'
import { SelectedFilterOptions } from '@/utils/helpers/filter'

describe('WorkOrdersFilter component', () => {
  const props = {
    filters: {
      Priority: [
        {
          key: '1',
          description: 'Immediate',
        },
        {
          key: '2',
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
    appliedFilters: {
      ContractorReference: ['PCL', 'AVP'],
      StatusCode: ['80'],
      Priorities: ['1', '2'],
    },
    loading: false,
    register: jest.fn(),
    clearFilters: jest.fn(),
    onFilterRemove: jest.fn(),
  }

  const selectedFilters = new SelectedFilterOptions(
    props.appliedFilters,
    props.filters
  ).getSelectedFilterOptions()

  describe('when logged in as a contractor with more than one contractor role', () => {
    it('should render properly with filter by contractor (only groups they belong to) and no authorisation pending approval status', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: multipleContractor }}>
          <WorkOrdersFilter
            filters={props.filters}
            loading={props.loading}
            register={props.register}
            clearFilters={props.clearFilters}
            appliedFilters={props.appliedFilters}
            selectedFilters={selectedFilters}
            onFilterRemove={props.onFilterRemove}
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
            appliedFilters={props.appliedFilters}
            selectedFilters={selectedFilters}
            onFilterRemove={props.onFilterRemove}
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
            appliedFilters={props.appliedFilters}
            selectedFilters={selectedFilters}
            onFilterRemove={props.onFilterRemove}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a combined agent/contractor', () => {
    it('should render properly with all filter options', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agentAndContractor }}>
          <WorkOrdersFilter
            filters={props.filters}
            loading={props.loading}
            register={props.register}
            clearFilters={props.clearFilters}
            appliedFilters={props.appliedFilters}
            selectedFilters={selectedFilters}
            onFilterRemove={props.onFilterRemove}
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
            appliedFilters={props.appliedFilters}
            selectedFilters={selectedFilters}
            onFilterRemove={props.onFilterRemove}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a combined authorisation manager/contractor', () => {
    it('should render properly with all filter options', () => {
      const { asFragment } = render(
        <UserContext.Provider
          value={{ user: authorisationManagerAndContractor }}
        >
          <WorkOrdersFilter
            filters={props.filters}
            loading={props.loading}
            register={props.register}
            clearFilters={props.clearFilters}
            appliedFilters={props.appliedFilters}
            selectedFilters={selectedFilters}
            onFilterRemove={props.onFilterRemove}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a combined contract manager/contractor', () => {
    it('should render properly with all filter options', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractManagerAndContractor }}>
          <WorkOrdersFilter
            filters={props.filters}
            loading={props.loading}
            register={props.register}
            clearFilters={props.clearFilters}
            appliedFilters={props.appliedFilters}
            selectedFilters={selectedFilters}
            onFilterRemove={props.onFilterRemove}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
