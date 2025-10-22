import { render } from '@testing-library/react'

import ContractorsListItems from './ContractorsListItems'

import { mockContractors } from '../mockContractorsData'

describe('Contractors list items component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(
      <ContractorsListItems contractors={mockContractors} />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
