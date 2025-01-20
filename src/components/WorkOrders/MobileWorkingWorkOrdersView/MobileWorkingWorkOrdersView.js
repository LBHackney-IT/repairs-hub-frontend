import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  frontEndApiRequest,
  fetchSimpleFeatureToggles,
} from '@/utils/frontEndApiClient/requests'
import { beginningOfDay } from '@/utils/time'
import { longMonthWeekday } from '@/utils/date'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import WarningInfoBox from '../../Template/WarningInfoBox'
import Meta from '../../Meta'
import { WorkOrder } from '../../../models/workOrder'
import { MobileWorkingWorkOrderListItems } from './MobileWorkingWorkOrderListItems'
import TabsVersionTwo from '../../TabsVersionTwo/Index'
import { Button } from '../../Form'

const SIXTY_SECONDS = 60 * 1000

const MobileWorkingWorkOrdersView = ({ currentUser }) => {
  const router = useRouter()
  const currentDate = beginningOfDay(new Date())
  const [visitedWorkOrders, setVisitedWorkOrders] = useState(null)
  const [sortedWorkOrders, setSortedWorkOrders] = useState(null)
  const [featureToggleStatus, setFeatureToggleStatus] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState()

  const titles = ['Current Work Orders', 'Past Work Orders']

  const handleTabClick = (index) => {
    index === 1 && router.push('/pastworkorders')
  }

  const ariaSelected = useMemo(() => {
    return router.pathname === '/pastworkorders' ? 1 : 0
  }, [router.pathname])

  const getOperativeWorkOrderView = async () => {
    if (currentUser === null || featureToggleStatus === null) return

    setError(null)

    setIsLoading(true)

    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/operatives/${currentUser.operativePayrollNumber}/appointments`,
        timeout: 5000,
      })

      const workOrders = data.map((wo) => new WorkOrder(wo))
      const visitedWorkOrders = workOrders.filter((wo) => wo.hasBeenVisited())

      const sortedWorkOrderItems = sortWorkOrderItems(currentUser, workOrders)

      setVisitedWorkOrders(visitedWorkOrders)
      setSortedWorkOrders(sortedWorkOrderItems)

      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      setVisitedWorkOrders(null)
      setSortedWorkOrders(null)

      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${
          e.response?.status
        } with message: ${JSON.stringify(
          e.response?.data?.message
        )}: with code: ${e.code}`
      )
    }
  }

  const handleRefresh = () => {
    getOperativeWorkOrderView()
  }

  const intervalRef = useRef(null)

  useEffect(() => {
    fetchSimpleFeatureToggles().then((data) => {
      setFeatureToggleStatus(data)
    })
  }, [])

  useEffect(() => {
    // Fetch after user and feature toggles are loaded
    if (currentUser === null || featureToggleStatus === null) return

    // initial fetch (otherwise it wont fetch until interval)
    getOperativeWorkOrderView()

    const intervalId = setInterval(() => {
      getOperativeWorkOrderView()
    }, SIXTY_SECONDS)

    intervalRef.current = intervalId

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [currentUser?.operativePayrollNumber, featureToggleStatus])

  const sortWorkOrderItems = (currentUser, workOrders) => {
    const inProgressWorkOrders = workOrders.filter((wo) => !wo.hasBeenVisited())

    const startedWorkOrders = workOrders.filter(
      (wo) => !wo.hasBeenVisited() && !!wo.appointment.startedAt?.length
    )

    // The operative is NOT an OJAAT operative
    if (!currentUser.isOneJobAtATime) return inProgressWorkOrders

    // If the operative has started a work order
    if (startedWorkOrders?.length) return startedWorkOrders

    // Return the next unstarted work order
    return inProgressWorkOrders
      .sort((a, b) => {
        return a.appointment.assignedStart.localeCompare(
          b.appointment.assignedStart
        )
      })
      .slice(0, 1)
  }

  return (
    <>
      <Meta title="Manage work orders" />
      {featureToggleStatus?.pastWorkOrdersFunctionalityEnabled == true ? (
        <TabsVersionTwo
          titles={titles}
          onTabChange={handleTabClick}
          ariaSelected={ariaSelected}
        />
      ) : (
        <></>
      )}
      <div className="mobile-work-order-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <h3
            className="lbh-heading-h3"
            style={{ flexShrink: 0, marginRight: '15px', marginBottom: '15px' }}
          >
            {longMonthWeekday(currentDate, { commaSeparated: false })}
          </h3>

          <Button
            style={{ marginTop: 0, marginBottom: '15px' }}
            onClick={handleRefresh}
            label="Refresh"
            type="button"
          />
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {sortedWorkOrders?.length || visitedWorkOrders?.length ? (
              <ol className="lbh-list mobile-working-work-order-list">
                <MobileWorkingWorkOrderListItems
                  workOrders={[...sortedWorkOrders, ...visitedWorkOrders]}
                  currentUser={currentUser}
                />
              </ol>
            ) : (
              <WarningInfoBox
                header="No work orders displayed"
                text="Please contact your supervisor"
              />
            )}
          </>
        )}
        {error && (
          <div>
            <ErrorMessage label={error} />
          </div>
        )}
      </div>
    </>
  )
}

export default MobileWorkingWorkOrdersView
