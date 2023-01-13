import {
  render,
  act,
  screen,
  waitFor
} from '@testing-library/react'
import SORContracts from './index'

describe('SORContracts component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(
      <SORContracts />
    )

    await act(async () => {
      await waitFor([
        screen.findAllByText('Contract reference')
      ])
    })

    expect(asFragment()).toMatchSnapshot()
  })
})