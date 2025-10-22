import { render } from '@testing-library/react'

import ContractorListItem from './ContractorListItem'

describe('Contractors list item component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(
      <ContractorListItem
        contractorReference={'SYC'}
        contractorName={'Sycous Limited'}
      />
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
