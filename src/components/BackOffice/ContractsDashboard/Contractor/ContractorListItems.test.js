import { render } from '@testing-library/react'

import ContractorsListItems from './ContractorsListItems'

import { mockContracts } from '../mockContractsData'

describe('Contractors list items component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(
      <ContractorsListItems contracts={mockContracts} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
