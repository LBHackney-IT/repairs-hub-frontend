import { render } from '@testing-library/react'
import UserContext from '../UserContext'
import CautionaryContactView from './CautionaryContactView'
import { operative } from 'factories/operative'
describe('CautionaryContactView component', () => {
  const query = {
    cautContact: ['VA', 'DAT', 'CIT'],
  }
  describe('when logged in as an operative and has NO queries', () => {
    it('should render properly: with NO highlithed codes', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: operative }}>
          <CautionaryContactView />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as an operative and has queries', () => {
    it('should render properly: with highlithed codes', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: operative }}>
          <CautionaryContactView query={query} />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
