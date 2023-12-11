import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '../../../utils/frontEndApiClient/requests'
import MobileWorkingLayout from '../../WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingLayout'
import WarningInfoBox from '../../Template/WarningInfoBox'
// import { MobileWorkingLayout } from '../../../components/WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingWorkOrdersView'

const OperativeMobileView = () => {
  const fetchOperatives = async () => {
    return await frontEndApiRequest({
      method: 'get',
      path: '/api/operatives',
    })
  }

  useEffect(() => {
    fetchOperatives().then((res) => {
      const sortedOperatives = res
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((x) => ({
          sub: 'placeholder',
          name: x.name,
          email: 'placeholder',
          varyLimit: 'placeholder',
          raiseLimit: 'placeholder',
          contractors: [],
          operativePayrollNumber: x.payrollNumber,
          isOneJobAtATime: x.isOnejobatatime,
        }))

      setOperatives(sortedOperatives)

      setIsLoading(false)
    })
  }, [])

  const [operatives, setOperatives] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [operativePayrollNumber, setOperativePayrollNumber] = useState(null)

  const selectedOperative = operatives.filter(
    (x) => x.operativePayrollNumber == operativePayrollNumber
  )[0]

  return (
    <div>
      <h1>Operative Mobile View</h1>

      <WarningInfoBox
        header="warning"
        text="This page uses same existing MobileWorkingWorkOrdersView component. This means you can click and view the jobs. Playing around with jobs will effect real operatives."
      />

      {isLoading ? (
        <div>Loading..</div>
      ) : (
        <div>
          <h1>Operatives</h1>

          {!!selectedOperative && (
            <pre
              style={{
                background: '#f1f5f9',
                color: '#475569',
                padding: 15,
              }}
            >
              {JSON.stringify(selectedOperative, null, 2)}
            </pre>
          )}

          <div style={{ marginBottom: '30px' }}>
            <select
              value={operativePayrollNumber}
              onChange={(e) => setOperativePayrollNumber(e.target.value)}
            >
              <option value="-1">Select an operative</option>

              {operatives.map((x) => (
                <option
                  key={x.operativePayrollNumber}
                  value={x.operativePayrollNumber}
                >
                  {x.name}
                </option>
              ))}

              <option value="otherOption">Other option</option>
            </select>
          </div>
          {/* <OperativeJobsList operative={selectedOperative} /> */}

          {/* <pre>{JSON.stringify(selectedOperative, null, 2)}</pre> */}

          {!!selectedOperative && (
            <MobileWorkingLayout currentUser={selectedOperative} />
          )}
        </div>
      )}
    </div>
  )
}

export default OperativeMobileView
