import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { beginningOfDay } from '../../utils/time'
import { longMonthWeekday } from '../../utils/date'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { GridColumn, GridRow } from '../Layout/Grid'
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

      // const data = [
      //   {
      //     reference: 10000621,
      //     dateRaised: '2021-06-11T13:49:15.878796Z',
      //     lastUpdated: null,
      //     priority: '5 [N] NORMAL',
      //     property: '17 Pitcairn House  St Thomass Square',
      //     owner: 'Herts Heritage Ltd',
      //     description: 'r',
      //     propertyReference: '00023405',
      //     tradeCode: 'PL',
      //     tradeDescription: 'Plumbing - PL',
      //     status: 'In Progress',
      //     appointment: {
      //       date: '2021-09-03',
      //       description: 'AM Slot',
      //       start: '08:00',
      //       end: '13:00',
      //       reason: null,
      //       note: null,
      //     },
      //   },
      //   {
      //     reference: 10000625,
      //     dateRaised: '2021-06-11T13:49:15.878796Z',
      //     lastUpdated: null,
      //     priority: '5 [N] NORMAL',
      //     property: '17 Pitcairn House  St Thomass Square',
      //     owner: 'Herts Heritage Ltd',
      //     description: 'r',
      //     propertyReference: '00023405',
      //     tradeCode: 'PL',
      //     tradeDescription: 'Plumbing - PL',
      //     status: 'In Progress',
      //     appointment: {
      //       date: '2021-09-03',
      //       description: 'AM Slot',
      //       start: '08:00',
      //       end: '13:00',
      //       reason: null,
      //       note: null,
      //     },
      //   },
      //   {
      //     reference: 10000624,
      //     dateRaised: '2021-06-11T13:49:15.878796Z',
      //     lastUpdated: null,
      //     priority: '5 [N] NORMAL',
      //     property: '17 Pitcairn House  St Thomass Square',
      //     owner: 'Herts Heritage Ltd',
      //     description: 'r',
      //     propertyReference: '00023405',
      //     tradeCode: 'PL',
      //     tradeDescription: 'Plumbing - PL',
      //     status: 'In Progress',
      //     appointment: {
      //       date: '2021-09-03',
      //       description: 'AM Slot',
      //       start: '08:00',
      //       end: '13:00',
      //       reason: null,
      //       note: null,
      //     },
      //   },
      //   {
      //     reference: 10000624,
      //     dateRaised: '2021-06-11T13:49:15.878796Z',
      //     lastUpdated: null,
      //     priority: '5 [N] NORMAL',
      //     property: '17 Pitcairn House  St Thomass Square',
      //     owner: 'Herts Heritage Ltd',
      //     description: 'r',
      //     propertyReference: '00023405',
      //     tradeCode: 'PL',
      //     tradeDescription: 'Plumbing - PL',
      //     status: 'In Progress',
      //     appointment: {
      //       date: '2021-09-03',
      //       description: 'AM Slot',
      //       start: '08:00',
      //       end: '13:00',
      //       reason: null,
      //       note: null,
      //     },
      //   },
      // ]

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
                <ol className="lbh-list">
                  {operativeWorkOrders.map((operativeWorkOrder, index) => (
                    <OperativeWorkOrderListItem
                      key={index}
                      operativeWorkOrder={operativeWorkOrder}
                      index={index}
                    />
                  ))}
                </ol>
              ) : (
                <WarningInfoBox
                  header="No work orders displayed"
                  text="Please contact your supervisor"
                />
              )}
              {error && <ErrorMessage label={error} />}
            </>
          )}
        </GridColumn>
      </GridRow>
    </>
  )
}

OperativeWorkOrderListItem.propTypes = {
  operativeWorkOrders: PropTypes.object.isRequired,
}

export default OperativeWorkOrdersView
