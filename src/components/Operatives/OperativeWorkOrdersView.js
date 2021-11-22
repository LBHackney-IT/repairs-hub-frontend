import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { beginningOfDay } from '@/utils/time'
import { longMonthWeekday } from '@/utils/date'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import OperativeWorkOrderListItem from './OperativeWorkOrderListItem'
import WarningInfoBox from '../Template/WarningInfoBox'
import Meta from '../Meta'

const OperativeWorkOrdersView = () => {
  const currentDate = beginningOfDay(new Date())
  const [operativeWorkOrders, setOperativeWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const getOperativeWorkOrderView = async () => {
    setLoading(true)
    setError(null)

    try {
      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/operatives/${currentUser.operativePayrollNumber}/workorders`,
      })

      setOperativeWorkOrders(data)
    } catch (e) {
      setOperativeWorkOrders(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    getOperativeWorkOrderView()
  }, [])

  return (
    <>
      <Meta title="Manage work orders" />
      <h1 className="lbh-heading-h1">{longMonthWeekday(currentDate)} </h1>
      <h3 className="lbh-heading-h3">Work orders</h3>
      {/* <GridRow className="lbh-body-s operative-work-orders">
        <GridColumn width="full"> */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {operativeWorkOrders?.length ? (
            <>
              <ol className="lbh-list">
                {operativeWorkOrders.map((operativeWorkOrder, index) => (
                  <OperativeWorkOrderListItem
                    key={index}
                    operativeWorkOrder={operativeWorkOrder}
                    index={index}
                    statusText={(() => {
                      const status = operativeWorkOrder.status.toLowerCase()

                      if (status === 'no access') {
                        return 'Closed'
                      } else if (status === 'work complete') {
                        return 'Completed'
                      } else {
                        return ''
                      }
                    })()}
                  />
                ))}
              </ol>
            </>
          ) : (
            <WarningInfoBox
              header="No work orders displayed"
              text="Please contact your supervisor"
            />
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
      {/* </GridColumn>
      </GridRow> */}
    </>
  )
}

export default OperativeWorkOrdersView
