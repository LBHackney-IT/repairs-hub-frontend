import { render } from '@testing-library/react'
import UserContext from '../UserContext'
import CautionaryContactTable from './CautionaryContactTable'
import { operative } from 'factories/operative'
import { CAUTIONARY_CONTACT } from '../../utils/cautContactAlerts'

describe('CautionaryContactTable component', () => {
  const props = {
    cautionaryContacts: CAUTIONARY_CONTACT,
    query: ['VA', 'DAT', 'CIT'],
  }

  describe('when logged in as an operative and has NO queries', () => {
    it('should render properly: with NO highlithed codes', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: operative }}>
          <CautionaryContactTable
            cautionaryContacts={props.cautionaryContacts}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as an operative and has queries', () => {
    it('should render properly: with highlithed codes', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: operative }}>
          <CautionaryContactTable
            cautionaryContacts={props.cautionaryContacts}
            query={props.query.cautContact}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
