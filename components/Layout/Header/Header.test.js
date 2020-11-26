import Header from './Header'
import { render } from '@testing-library/react'

describe('Header', () => {
  it('renders a Header with serviceName props', () => {
    const serviceName = 'This is the Header'
    const { getByText } = render(<Header serviceName={serviceName} />)
    const header = getByText(serviceName)
    expect(header).toBeInTheDocument()
  })
})
