import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { beginningOfDay } from '@/utils/time'
import { longMonthWeekday } from '@/utils/date'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import Meta from '../../Meta'
import { WorkOrder } from '../../../models/workOrder'
import { WorkOrderList } from './WorkOrderList'

const MobileWorkingLayout = (props) => {
  const { currentUser } = props

  const currentDate = beginningOfDay(new Date())
  const [workOrders, setWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const getOperativeWorkOrderView = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/operatives/${currentUser.operativePayrollNumber}/workorders`,
      })

      const workOrders = data.map((wo) => new WorkOrder(wo))

      setWorkOrders(workOrders)
    } catch (e) {
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    getOperativeWorkOrderView()
  }, [currentUser?.operativePayrollNumber])

  return (
    <>
      <Meta title="Manage work orders" />
      <div className="mobile-working-title-banner">
        <h2 className="lbh-heading-h2">
          {longMonthWeekday(currentDate, { commaSeparated: false })}
        </h2>
      </div>

      <h3 className="lbh-heading-h3">Work orders</h3>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <WorkOrderList currentUser={currentUser} workOrders={workOrders} />

          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default MobileWorkingLayout
