import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '../../../utils/frontEndApiClient/requests'
import WarningInfoBox from '../../Template/WarningInfoBox'
import SelectedOperative from './SelectedOperative'
import Layout from '../Layout'
import MobileWorkingWorkOrdersView from '../../WorkOrders/MobileWorkingWorkOrdersView/MobileWorkingWorkOrdersView'
import { filterOperatives } from './utils'
import { useRouter } from 'next/router'

const OperativeMobileView = () => {
  const router = useRouter()

  const fetchOperatives = async () =>
    new Promise((resolve) => {
      setIsLoading(true)

      frontEndApiRequest({
        method: 'get',
        path: '/api/operatives',
      })
        .then((res) => {
          const sortedOperatives = res
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(mapOperativeToHubUser)

          setOperatives(sortedOperatives)
        })
        .finally(() => {
          setIsLoading(false)
          resolve()
        })
    })

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

  // const refresh =

  const refresh = () => {
    // hacky implementation? yes! but idc, this is backoffice
    const opn = operativePayrollNumber

    setOperativePayrollNumber(() => null)
    setTimeout(setOperativePayrollNumber(() => opn))
  }

  const [operatives, setOperatives] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [operativeFilter, setOperativeFilter] = useState('')
  const [OJAATEnabled, setOJAATEnabled] = useState(false)

  const [operativePayrollNumber, setOperativePayrollNumber] = useState(null)

  const [selectedOperative, setSelectedOperative] = useState(null)

  useEffect(() => {
    fetchOperatives().then(() => {
      const query = router.query

      if (!query.hasOwnProperty('operative')) return

      setTimeout(() => setOperativePayrollNumber(() => query.operative))
    })
  }, [])

  const filteredOperativeList = filterOperatives(operatives, operativeFilter)

  useEffect(() => {
    console.log('updating', operativePayrollNumber, operatives.length)
    const selectedOperative = operatives.filter(
      (x) => x.operativePayrollNumber == operativePayrollNumber
    )[0]

    if (selectedOperative === null || selectedOperative === undefined) {
      setSelectedOperative(null)
      return
    }

    // populate override OJATT button state
    setOJAATEnabled(selectedOperative.isOneJobAtATime)

    // Set current opeative
    setSelectedOperative(selectedOperative)

    const query = { operative: selectedOperative.operativePayrollNumber }
    router.push({ query }, undefined, { shallow: true })
  }, [operativePayrollNumber])

  useEffect(() => {
    if (selectedOperative === null || selectedOperative === undefined) return

    // override OJATT enabled status
    setSelectedOperative((x) => ({
      ...x,
      isOneJobAtATime: OJAATEnabled,
    }))
  }, [OJAATEnabled])

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
                <label>Override OJAT enabled</label>

                <input
                  type="checkbox"
                  value={false}
                  checked={OJAATEnabled}
                  onInput={() => setOJAATEnabled((x) => !x)}
                />
              </div>

              <div>
                <button onClick={refresh}>Refresh</button>
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
