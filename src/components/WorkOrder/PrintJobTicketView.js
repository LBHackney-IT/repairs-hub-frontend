import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import PrintJobTicketDetails from './PrintJobTicketDetails'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { WorkOrder } from '../../models/workOrder'
import BackButton from '../Layout/BackButton/BackButton'

const PrintJobTicketView = ({ workOrderReference }) => {
  const [property, setProperty] = useState({})
  const [workOrder, setWorkOrder] = useState({})
  const [tenure, setTenure] = useState({})
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getPrintJobTicketView = async (workOrderReference) => {
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

      setWorkOrder(new WorkOrder(workOrder))
      setProperty(propertyObject.property)
      if (propertyObject.tenure) setTenure(propertyObject.tenure)
      setTasksAndSors(tasksAndSors)
    } catch (e) {
      setWorkOrder(null)
      setProperty(null)
      setTasksAndSors(null)
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

  useEffect(() => {
    setLoading(true)

    getPrintJobTicketView(workOrderReference)
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
            workOrder &&
            tasksAndSors && (
              <>
                <div>
                  <BackButton />
                </div>
                <PrintJobTicketDetails
                  propertyReference={property.propertyReference}
                  workOrder={workOrder}
                  address={property.address}
                  tmoName={property.tmoName}
                  tenure={tenure}
                  subTypeDescription={property.hierarchyType.subTypeDescription}
                  tasksAndSors={tasksAndSors}
                />
              </>
            )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

PrintJobTicketView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default PrintJobTicketView
