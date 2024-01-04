import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '../../../utils/frontEndApiClient/requests'
import MobileWorkingLayout from '../../WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingLayout'
import WarningInfoBox from '../../Template/WarningInfoBox'
import SelectedOperative from './SelectedOperative'
import Layout from '../Layout'

const OperativeMobileView = () => {
  const fetchOperatives = async () => {
    return await frontEndApiRequest({
      method: 'get',
      path: '/api/operatives',
    })
  }

  const mapOperativeToHubUser = (operative) => {
    return {
      sub: 'placeholder',
      name: operative.name,
      email: 'placeholder',
      varyLimit: 'placeholder',
      raiseLimit: 'placeholder',
      contractors: [],
      operativePayrollNumber: operative.payrollNumber,
      isOneJobAtATime: operative.isOnejobatatime,
    }
  }

  useEffect(() => {
    fetchOperatives().then((res) => {
      const sortedOperatives = res
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(mapOperativeToHubUser)

      setOperatives(sortedOperatives)

      setIsLoading(false)
    })
  }, [])

  const [operatives, setOperatives] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [operativeFilter, setOperativeFilter] = useState('')

  const [operativePayrollNumber, setOperativePayrollNumber] = useState(null)

  const filteredOperativeList =
    operativeFilter === ''
      ? operatives
      : operatives.filter((x) =>
          x.name.toLowerCase().includes(operativeFilter.toLowerCase())
        )

  const selectedOperative = operatives.filter(
    (x) => x.operativePayrollNumber == operativePayrollNumber
  )[0]

  return (
    <Layout title="Operative Mobile View">
      <>
        <WarningInfoBox
          header="Warning"
          text="This page uses same existing MobileWorkingWorkOrdersView component. This means you can click and view the jobs. Playing around with jobs will effect real operatives."
        />

        {isLoading ? (
          <div>Loading..</div>
        ) : (
          <div>
            <div>
              {!!selectedOperative && (
                <SelectedOperative operative={selectedOperative} />
              )}

              <div>
                <label>Filter operatives </label>

                <input
                  type="text"
                  value={operativeFilter}
                  onInput={(e) => setOperativeFilter(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <select
                  value={operativePayrollNumber}
                  onChange={(e) => setOperativePayrollNumber(e.target.value)}
                >
                  <option value="-1" defaultChecked>
                    Select an operative
                  </option>

                  {filteredOperativeList.map((x) => (
                    <option
                      key={x.operativePayrollNumber}
                      value={x.operativePayrollNumber}
                    >
                      {x.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p>{filteredOperativeList.length} operatives</p>
              </div>
            </div>

            {!!selectedOperative && (
              <div style={{ marginTop: '15px' }}>
                <MobileWorkingLayout currentUser={selectedOperative} />
              </div>
            )}
          </div>
        )}
      </>
    </Layout>
  )
}

export default OperativeMobileView
