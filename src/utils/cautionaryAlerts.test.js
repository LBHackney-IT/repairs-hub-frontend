import { getCautionaryAlertsType } from './cautionaryAlerts'

describe('getCautionaryAlertsType', () => {
  it('accepts an array of alerts and returns their unique types', () => {
    expect(
      getCautionaryAlertsType([
        {
          type: 'DAT',
        },
        {
          type: 'CFT',
        },
        {
          type: 'CIT',
        },
        {
          type: 'DAT',
        },
        {
          type: 'CFT',
        },
        {
          type: 'SAT',
        },
      ])
    ).toEqual(['DAT', 'CFT', 'CIT', 'SAT'])
  })
})
