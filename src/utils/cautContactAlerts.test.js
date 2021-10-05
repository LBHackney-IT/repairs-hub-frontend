import { getCautionaryAlertsType } from './cautContactAlerts'

describe('getCautionaryAlertsType', () => {
  it('combines two arrays of alerts and returns types of alerts', () => {
    const locationAlerts = [
      {
        type: 'DAT',
      },
      {
        type: 'CFT',
      },
      {
        type: 'CIT',
      },
    ]
    const personAlerts = [
      {
        type: 'DAT',
      },
      {
        type: 'CFT',
      },
      {
        type: 'SAT',
      },
    ]

    expect(getCautionaryAlertsType(locationAlerts, personAlerts)).toEqual(
      'DAT, CFT, CIT, SAT'
    )
  })
})
