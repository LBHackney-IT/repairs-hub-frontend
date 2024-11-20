import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { buildOperativeAssignmentFormData } from '@/utils/hact/jobStatusUpdate/assignOperatives'
import { WorkOrder } from '@/models/workOrder'
import OperativeForm from './OperativeForm'
import { sortOperativesWithPayrollFirst } from '@/utils/helpers/operatives'

const OperativeFormView = ({ workOrderReference }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [workOrder, setWorkOrder] = useState()
  const [currentUser, setCurrentUser] = useState({})
  const [availableOperatives, setAvailableOperatives] = useState([])
  const [selectedOperatives, setSelectedOperatives] = useState([])
  const [
    selectedPercentagesToShowOnEdit,
    setSelectedPercentagesToShowOnEdit,
  ] = useState([])

  const OPERATIVE_ID_REGEX = /\[(\d+)\]$/

  const makePostRequest = async (operativeAssignmentFormData) => {
    setLoading(true)

    try {
      await frontEndApiRequest({
        method: 'post',
        path: `/api/jobStatusUpdate`,
        requestData: operativeAssignmentFormData,
      })

      router.push(
        `/operatives/${currentUser?.operativePayrollNumber}/work-orders/${workOrderReference}`
      )
    } catch (e) {
      console.error(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${JSON.stringify(e.response?.data?.message)}`
      )
      setLoading(false)
    }
  }

  const getOperatives = async (workOrderReference) => {
    setError(null)

    try {
      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setCurrentUser(currentUser)

      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
      })

      setWorkOrder(new WorkOrder(workOrder))

      const sortedOperatives = sortOperativesWithPayrollFirst(
        workOrder.operatives,
        currentUser.operativePayrollNumber
      )

      setSelectedOperatives(sortedOperatives)
      setSelectedPercentagesToShowOnEdit(
        sortedOperatives.map((o) => `${o.jobPercentage}%`)
      )

      const operatives = await frontEndApiRequest({
        method: 'get',
        path: `/api/operatives`,
      })
      setAvailableOperatives(operatives)
    } catch (e) {
      setWorkOrder(null)
      setAvailableOperatives([])
      console.error('An error has occured:', e.response)

      if (e.response?.status === 404) {
        setError(
          `Could not find a work order with reference ${workOrderReference}`
        )
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${JSON.stringify(e.response?.data?.message)}`
        )
      }
    }

    setLoading(false)
  }

  const operativesAndPercentagesForNotes = (opsAndPercentages) => {
    return opsAndPercentages
      .map(
        (op) =>
          `${op.operative.name}${op.percentage ? ` : ${op.percentage}` : ''}`
      )
      .join(', ')
  }

  const onSubmit = (e) => {
    const operativeIds = Object.keys(e)
      .filter((k) => k.match(/operative-\d+/))
      .map((operativeKey) => {
        const matches = e[operativeKey].match(OPERATIVE_ID_REGEX)

        if (Array.isArray(matches)) {
          return Number.parseInt(matches[matches.length - 1])
        }
      })

    const percentages = Object.entries(e)
      .filter(([key]) => key.match(/^percentage-\d+$/))
      .map(([, value]) => value)

    setSelectedOperatives(
      operativeIds.map((operativeId) =>
        availableOperatives.find((operative) => operative.id === operativeId)
      )
    )
    setSelectedPercentagesToShowOnEdit(percentages)

    const operativesWithPercentages = operativeIds.map((operativeId, index) => {
      return {
        operative: availableOperatives.find(
          (operative) => operative.id === operativeId
        ),
        percentage: percentages[index],
      }
    })

    const operativesAssignedNote =
      operativesWithPercentages.length > 0 &&
      `Assigned operatives ${operativesAndPercentagesForNotes(
        operativesWithPercentages
      )}`

    const operativeAssignmentFormData = buildOperativeAssignmentFormData(
      workOrderReference,
      operativesWithPercentages,
      operativesAssignedNote,
      true
    )

    makePostRequest(operativeAssignmentFormData)
  }

  useEffect(() => {
    setLoading(true)

    getOperatives(workOrderReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!workOrder && error && <ErrorMessage label={error} />}

          {workOrder && (
            <>
              <OperativeForm
                reference={workOrder.reference}
                onSubmit={onSubmit}
                assignedOperativesToWorkOrder={selectedOperatives}
                availableOperatives={availableOperatives}
                selectedPercentagesToShowOnEdit={
                  selectedPercentagesToShowOnEdit
                }
                totalSMV={workOrder.totalSMVs}
                currentUserPayrollNumber={currentUser.operativePayrollNumber}
              />
              {error && <ErrorMessage label={error} />}
            </>
          )}
        </>
      )}
    </>
  )
}

OperativeFormView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default OperativeFormView
