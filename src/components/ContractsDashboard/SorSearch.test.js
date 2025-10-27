import { render, fireEvent, act, screen } from '@testing-library/react'

import SorSearch from './SorSearch'
import { mockSorCodeContracts } from './mockContractsData'

describe('SorSearch component', () => {
  it('should render search bar and title when nothing has been searched', () => {
    const { asFragment } = render(
      <SorSearch
        searchHeadingText={'Check an SOR code'}
        searchLabelText={`Find out which Sycous Limited contracts an SOR code exists in`}
        sorCode={''}
        setSorCode={jest.fn()}
        isLoading={false}
        error={null}
        handleSubmit={jest.fn()}
        contractorName={'Sycous Limited'}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render contracts with sor code that has been searched in descending date order', async () => {
    const descendingDateContractsWithSorCode = [
      ...mockSorCodeContracts,
    ].reverse()

    const { asFragment } = render(
      <SorSearch
        contracts={descendingDateContractsWithSorCode}
        searchHeadingText={'Check an SOR code'}
        searchLabelText={`Find out which Sycous Limited contracts an SOR code exists in`}
        sorCode={'ABC123'}
        setSorCode={jest.fn()}
        isLoading={false}
        error={null}
        handleSubmit={jest.fn()}
        contractorName={'Sycous Limited'}
      />
    )
    await act(async () => {
      fireEvent.change(screen.getByTestId('input-search'), {
        target: { value: 'ABC123' },
      })

      fireEvent.click(screen.getByTestId('submit-search'))
    })
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render no contracts found', async () => {
    const { asFragment } = render(
      <SorSearch
        contracts={[]}
        searchHeadingText={'Check an SOR code'}
        searchLabelText={`Find out which Sycous Limited contracts an SOR code exists in`}
        sorCode={'12'}
        setSorCode={jest.fn()}
        isLoading={false}
        error={null}
        handleSubmit={jest.fn()}
        contractorName={'Sycous Limited'}
      />
    )
    await act(async () => {
      fireEvent.change(screen.getByTestId('input-search'), {
        target: { value: '12' },
      })

      fireEvent.click(screen.getByTestId('submit-search'))
    })
    expect(asFragment()).toMatchSnapshot()
  })
})
