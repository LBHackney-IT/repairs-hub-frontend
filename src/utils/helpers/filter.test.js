import { SelectedFilterOptions, setFilterOptions } from './filter'

describe('#setFilterOptions', () => {
  const formData = {
    ContractorReference: {
      AVP: false,
      PCL: true,
      SCC: true,
    },
    StatusCode: { 30: false, 50: false, 80: true },
    Priorities: { 1: true, 2: false, 3: false },
    TradeCodes: { PL: true, BK: false, EL: true },
  }

  it('takes the formData sets what the applied filters are', () => {
    expect(setFilterOptions(formData)).toEqual({
      ContractorReference: ['PCL', 'SCC'],
      Priorities: ['1'],
      StatusCode: ['80'],
      TradeCodes: ['PL', 'EL'],
    })
  })
})

describe('SelectedFilterOptions', () => {
  const filters = {
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
        description: 'Cancelled',
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
        description: 'PURDY CONTRACTS (C2A)',
      },
      {
        key: 'SCC',
        description: 'Alphatrack (S) Systems Lt',
      },
    ],
  }

  describe('#getSelectedFilterOptions', () => {
    it('when one option of each filter category is selected', () => {
      const appliedFilters = {
        ContractorReference: 'PCL',
        StatusCode: '80',
        Priorities: '1',
        TradeCodes: 'EL',
      }

      expect(
        new SelectedFilterOptions(
          appliedFilters,
          filters
        ).getSelectedFilterOptions()
      ).toEqual({
        Contractor: ['PURDY CONTRACTS (C2A)'],
        Priority: ['Immediate'],
        Status: ['In Progress'],
        Trade: ['Electrical'],
      })
    })

    it('when more than one option of all filter categories are selected', () => {
      const appliedFilters = {
        ContractorReference: ['PCL', 'AVP'],
        StatusCode: ['80', '50'],
        Priorities: ['1', '2'],
        TradeCodes: ['EL', 'PL'],
      }

      expect(
        new SelectedFilterOptions(
          appliedFilters,
          filters
        ).getSelectedFilterOptions()
      ).toEqual({
        Contractor: ['PURDY CONTRACTS (C2A)', 'Avonline Network (A) Ltd'],
        Priority: ['Immediate', 'Emergency'],
        Status: ['In Progress', 'Complete'],
        Trade: ['Electrical', 'Plumbing'],
      })
    })

    it('when not all filter categories are selected', () => {
      const appliedFilters = {
        ContractorReference: ['PCL', 'AVP'],
        Priorities: '1',
      }

      expect(
        new SelectedFilterOptions(
          appliedFilters,
          filters
        ).getSelectedFilterOptions()
      ).toEqual({
        Contractor: ['PURDY CONTRACTS (C2A)', 'Avonline Network (A) Ltd'],
        Priority: ['Immediate'],
      })
    })

    it('when there is nothing selected', () => {
      const appliedFilters = {}

      expect(
        new SelectedFilterOptions(
          appliedFilters,
          filters
        ).getSelectedFilterOptions()
      ).toEqual({})
    })
  })
})
