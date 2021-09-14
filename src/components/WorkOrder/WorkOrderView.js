import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import WorkOrderDetails from './WorkOrderDetails'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { getOrCreateSchedulerSessionId } from '../../utils/frontEndApiClient/users/schedulerSession'
import Tabs from '../Tabs'
import { WorkOrder } from '../../models/workOrder'
import { sortObjectsByDateKey } from '../../utils/date'
import PrintJobTicketDetails from './PrintJobTicketDetails'
import OperativeWorkOrderDetails from '../Operatives/OperativeWorkOrderDetails'
import TasksAndSorsView from './TasksAndSors/TasksAndSorsView'
import UserContext from '../UserContext/UserContext'
import { canSeeWorkOrder } from '../../utils/userPermissions'

const WorkOrderView = ({ workOrderReference }) => {
  const { user } = useContext(UserContext)
  const [property, setProperty] = useState({})
  const [workOrder, setWorkOrder] = useState({})
  const [locationAlerts, setLocationAlerts] = useState([])
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [schedulerSessionId, setSchedulerSessionId] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const tabsList = [
    'Tasks and SORs',
    'Notes',
    'Pending variation',
    'Work orders history',
  ]

  const { NEXT_PUBLIC_STATIC_IMAGES_BUCKET_URL } = process.env

  const printClickHandler = (e) => {
    e.preventDefault()

    if (document.getElementById('rear-image')) {
      window.print()
    } else {
      const workOrderRearImage = document.createElement('img')
      workOrderRearImage.src = `${NEXT_PUBLIC_STATIC_IMAGES_BUCKET_URL}/work-order-rear.png`
      workOrderRearImage.id = 'rear-image'

      workOrderRearImage.addEventListener('load', () => window.print())

      document
        .getElementById('rear-image-container')
        .appendChild(workOrderRearImage)
    }
  }

  const getWorkOrderView = async (workOrderReference) => {
    setError(null)

    try {
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
      })
      const propertyObject = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${workOrder.propertyReference}`,
      })

      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      // const workOrder = {
      //   reference: 10000621,
      //   dateRaised: '2021-06-11T08:44:17.974874Z',
      //   lastUpdated: null,
      //   priority: '5 [N] NORMAL',
      //   property: '409 Queensbridge Road',
      //   owner: 'HH General Building Repai',
      //   description: 'test',
      //   propertyReference: '00023631',
      //   target: '2021-07-12T08:44:16.993Z',
      //   raisedBy: 'Repairs Testing-Agent',
      //   callerNumber: '\t02072415158',
      //   callerName: 'Elizabeth Coyle',
      //   priorityCode: 4,
      //   status: 'In Progress',
      //   contractorReference: 'H01',
      //   tradeCode: 'CP',
      //   tradeDescription: 'Carpentry and Joinery - CP',
      //   appointment: null,
      //   operatives: [],
      //   action: 'Unknown',
      //   externalAppointmentManagementUrl: null,
      //   canAssignOperative: true,
      //   closedDated: null,
      //   plannerComments: 'planner Comment',
      //   appointment: {
      //     date: '2021-09-03',
      //     description: 'AM Slot',
      //     start: '08:00',
      //     end: '13:00',
      //     reason: null,
      //     note: 'School run',
      //   },
      // }

      // const tasksAndSors = [
      //   {
      //     id: 'bb9b6ed1-fdd7-41e8-8f28-24af37b91b00',
      //     code: '20040010',
      //     description: 'REPAIR TIMBER WINDOWS NE.2NR',
      //     dateAdded: '2021-06-11T08:44:17.967915Z',
      //     dateUpdated: '2021-06-11T08:44:17.967915Z',
      //     quantity: 1,
      //     cost: 74.89,
      //     status: 'Unknown',
      //     original: true,
      //     originalQuantity: 1,
      //     standardMinuteValue: 95,
      //   },
      // ]

      // const propertyObject = {
      //   property: {
      //     propertyReference: '00012345',
      //     address: {
      //       shortAddress: '16 Pitcairn House  St Thomass Square',
      //       postalCode: 'E9 6PT',
      //       addressLine: '16 Pitcairn House',
      //       streetSuffix: 'St Thomass Square',
      //     },
      //     hierarchyType: {
      //       levelCode: '7',
      //       subTypeCode: 'DWE',
      //       subTypeDescription: 'Dwelling',
      //     },
      //     canRaiseRepair: true,
      //   },
      //   alerts: {
      //     locationAlert: [
      //       {
      //         type: 'DIS',
      //         comments: 'Property Under Disrepair',
      //         startDate: '2011-02-16',
      //         endDate: null,
      //       },
      //     ],
      //     personAlert: [
      //       {
      //         type: 'CV',
      //         comments: 'No Lone Visits',
      //         startDate: '2013-03-16',
      //         endDate: null,
      //       },
      //       {
      //         type: 'VA',
      //         comments: 'Verbal Abuse or Threat of',
      //         startDate: '2014-02-10',
      //         endDate: null,
      //       },
      //     ],
      //   },
      //   tenure: {
      //     typeCode: 'SEC',
      //     typeDescription: 'Secure',
      //   },
      //   contacts: [
      //     {
      //       firstName: 'Mark',
      //       lastName: 'Gardner',
      //       phoneNumbers: ['00000111111', '00000222222'],
      //     },
      //     {
      //       firstName: 'Luam',
      //       lastName: 'Berhane',
      //       phoneNumbers: ['00000666666'],
      //     },
      //   ],
      // }

      setTasksAndSors(
        sortObjectsByDateKey(tasksAndSors, ['dateAdded'], 'dateAdded')
      )

      // Call getOrCreateSchedulerSessionId if it is a DRS work order
      if (workOrder.externalAppointmentManagementUrl) {
        const schedulerSessionId = await getOrCreateSchedulerSessionId()
        setSchedulerSessionId(schedulerSessionId)
      }

      setWorkOrder(new WorkOrder(workOrder))
      setProperty(propertyObject.property)
      setLocationAlerts(propertyObject.alerts.locationAlert)
      setPersonAlerts(propertyObject.alerts.personAlert)
      if (propertyObject.tenure) setTenure(propertyObject.tenure)
    } catch (e) {
      setWorkOrder(null)
      setProperty(null)
      console.error('An error has occured:', e.response)

      if (e.response?.status === 404) {
        setError(
          `Could not find a work order with reference ${workOrderReference}`
        )
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
        )
      }
    }

    setLoading(false)
  }

  const renderOperativeWorkOrder = () => {
    return (
      <>
        <OperativeWorkOrderDetails
          property={property}
          workOrder={workOrder}
          personAlerts={personAlerts}
          tasksAndSors={tasksAndSors}
        />

        <TasksAndSorsView
          workOrderReference={workOrderReference}
          tabName={'Tasks and SORs'}
          tasksAndSors={tasksAndSors}
          showOperativeTasksAndSorsTable={true}
        />
      </>
    )
  }

  const renderWorkOrder = () => {
    return (
      <>
        <WorkOrderDetails
          property={property}
          workOrder={workOrder}
          tenure={tenure}
          locationAlerts={locationAlerts}
          personAlerts={personAlerts}
          schedulerSessionId={schedulerSessionId}
          tasksAndSors={tasksAndSors}
          printClickHandler={printClickHandler}
        />
        <Tabs
          tabsList={tabsList}
          propertyReference={property.propertyReference}
          workOrderReference={workOrderReference}
          tasksAndSors={tasksAndSors}
        />
        {/* Only displayed for print media */}
        <PrintJobTicketDetails
          workOrder={workOrder}
          address={property.address}
          tmoName={property.tmoName}
          tenure={tenure}
          tasksAndSors={tasksAndSors}
        />
      </>
    )
  }

  const renderWorkOrderView = () => {
    return user && canSeeWorkOrder(user)
      ? renderWorkOrder()
      : renderOperativeWorkOrder()
  }

  useEffect(() => {
    setLoading(true)

    getWorkOrderView(workOrderReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {property &&
            property.address &&
            property.hierarchyType &&
            tenure &&
            locationAlerts &&
            personAlerts &&
            workOrder &&
            renderWorkOrderView()}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

WorkOrderView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default WorkOrderView
