import { render } from '@testing-library/react'
import UserContext from '../UserContext'
import CautionaryAlertsTable from './CautionaryAlertsTable'
import { operative } from 'factories/operative'
import { CAUTIONARY_ALERTS } from '@/utils/cautionaryAlerts'

describe('CautionaryAlertsTable component', () => {
  const props = {
    cautionaryAlerts: CAUTIONARY_ALERTS,
    query: ['VA', 'DAT', 'CIT'],
  }

  describe('when logged in as an operative and has NO queries', () => {
    it('should render properly: with NO highlithed codes', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: operative }}>
          <CautionaryAlertsTable cautionaryAlerts={props.cautionaryAlerts} />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as an operative and has queries', () => {
    it('should render properly: with highlithed codes', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: operative }}>
          <CautionaryAlertsTable
            cautionaryAlerts={props.cautionaryAlerts}
            query={props.query.cautContact}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
