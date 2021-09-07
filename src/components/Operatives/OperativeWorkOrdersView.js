import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { beginningOfDay } from '../../utils/time'
import { longMonthWeekday } from '../../utils/date'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { GridColumn, GridRow } from '../Layout/Grid'
import OperativeWorkOrderListItem from './OperativeWorkOrderListItem'
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
      <GridRow className="lbh-body-s">
        <GridColumn width="full">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <h1 className="lbh-heading-h1">
                {longMonthWeekday(currentDate)}{' '}
              </h1>
              {operativeWorkOrders?.length ? (
                <OperativeWorkOrderListItem
                  operativeWorkOrders={operativeWorkOrders}
                />
              ) : (
                <div className="warning-info-box govuk-inset-text lbh-inset-text">
                  <div className="lbh-warning-text govuk-warning-text">
                    <span
                      className="govuk-warning-text__icon"
                      aria-hidden="true"
                    >
                      !
                    </span>
                    <div className="govuk-warning-text__text">
                      <span className="govuk-warning-text__assistive">
                        Warning
                      </span>
                      <p className="govuk-!-margin-top-0 lbh-body-s lbh-!-font-weight-bold">
                        No work orders displayed
                      </p>
                      <p className="lbh-body-xs govuk-!-margin-top-1">
                        Please contact your supervisor
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {error && <ErrorMessage label={error} />}
            </>
          )}
        </GridColumn>
      </GridRow>
    </>
  )
}

export default OperativeWorkOrdersView
