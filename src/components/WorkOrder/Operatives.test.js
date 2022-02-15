import { render } from '@testing-library/react'
import Operatives from '@/components/WorkOrder/Operatives'

describe('Operatives component', () => {
  it('Renders a string with a prefix of "Operative" when passed one operative', () => {
    const { asFragment } = render(
      <Operatives operatives={[{ name: 'Operative Name 1' }]} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders a string with a prefix of "Operatives" when passed multiple operative', () => {
    const { asFragment } = render(
      <Operatives
        operatives={[
          { name: 'Operative Name 1' },
          { name: 'Operative Name 2' },
        ]}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
