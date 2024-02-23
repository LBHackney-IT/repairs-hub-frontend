import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '../../../utils/frontEndApiClient/requests'
import WarningInfoBox from '../../Template/WarningInfoBox'
import SelectedOperative from './SelectedOperative'
import Layout from '../Layout'
import MobileWorkingWorkOrdersView from '../../WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingWorkOrdersView'
import { filterOperatives } from './utils'

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
  const [showOnlyOJAT, setShowOnlyOJAT] = useState(false)

  const [operativePayrollNumber, setOperativePayrollNumber] = useState(null)

  const filteredOperativeList = filterOperatives(
    operatives,
    operativeFilter,
    showOnlyOJAT
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
              <div>
                <label>Filter operatives </label>

                <input
                  type="text"
                  value={operativeFilter}
                  onInput={(e) => setOperativeFilter(e.target.value)}
                />
              </div>

              <div>
                <label>Show only OJAT operatives?</label>
                <input
                  type="checkbox"
                  value={false}
                  checked={showOnlyOJAT}
                  onInput={() => setShowOnlyOJAT((x) => !x)}
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

              {!!selectedOperative && (
                <SelectedOperative operative={selectedOperative} />
              )}
            </div>

            {!!selectedOperative && (
              <div style={{ marginTop: '30px' }}>
                <MobileWorkingWorkOrdersView
                  currentUser={selectedOperative}
                  loggingEnabled={false}
                />
              </div>
            )}
          </div>
        )}
      </>
    </Layout>
  )
}

export default OperativeMobileView
