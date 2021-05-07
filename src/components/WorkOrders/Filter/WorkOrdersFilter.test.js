import { render } from '@testing-library/react'
import UserContext from '../../UserContext/UserContext'
import WorkOrdersFilter from './WorkOrdersFilter'

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
    },
    loading: false,
    register: jest.fn(),
    clearFilters: jest.fn(),
  }

  describe('When logged in as a contract manager', () => {
    const user = {
      name: 'A Contractor',
      email: 'a.contractor@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: false,
      hasContractManagerPermissions: true,
      hasAnyPermissions: true,
    }

    it('should render properly with all filter options', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
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

  describe('When logged in as a contractor', () => {
    const user = {
      name: 'A Contractor',
      email: 'a.contractor@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: true,
      hasContractManagerPermissions: false,
      hasAnyPermissions: true,
    }

    it('should render properly with filter options except authorisation pending approval', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
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

  describe('When logged in as an authorisation manager', () => {
    const user = {
      name: 'An Authorisation Manager',
      email: 'an.authorisation-manager@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: false,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: true,
      hasAnyPermissions: true,
    }

    it('should render properly with all filter options', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
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
