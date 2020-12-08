import AuthHeader from '../../../../utils/AuthHeader'
import { getAlerts } from './cautionary_alerts'
import mockAxios from '../__mocks__/axios'

const { NEXT_PUBLIC_ENDPOINT_API } = process.env

describe('getAlerts', () => {
  it('fetches successfully data from an API', async () => {
    const alerts = {
      propertyReference: '00012345',
      alerts: [
        {
          alertCode: 'DIS',
          description: 'Property Under Disrepair',
          startDate: '2011-02-16',
          endDate: null,
        },
      ],
    }

    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: alerts,
      })
    )

    const response = await getAlerts('00012345')

    expect(response).toEqual(alerts)
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(
      mockAxios.get
    ).toHaveBeenCalledWith(
      `${NEXT_PUBLIC_ENDPOINT_API}/properties/00012345/cautionary-alerts`,
      { headers: AuthHeader() }
    )
  })
})
