import { render } from '@testing-library/react'
import Header from './Header'
import UserContext from '../../UserContext/UserContext'

describe('Header', () => {
  const serviceName = 'Hackney Header'

  it('should render service name with logout link', () => {
    const { getByText } = render(
      <UserContext.Provider
        value={{
          user: { name: 'bar' },
        }}
      >
        <Header serviceName={serviceName} />
      </UserContext.Provider>
    )

    expect(getByText(serviceName)).toBeInTheDocument()
    expect(getByText('Logout')).toBeInTheDocument()
  })
  it('should render service name without logout link', () => {
    const { getByText, queryByText } = render(
      <UserContext.Provider
        value={{
          user: null,
        }}
      >
        <Header serviceName={serviceName} />
      </UserContext.Provider>
    )

    expect(getByText(serviceName)).toBeInTheDocument()
    expect(queryByText('Logout')).not.toBeInTheDocument()
  })
})
