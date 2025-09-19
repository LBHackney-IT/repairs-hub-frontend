import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { buildOperativeAssignmentFormData } from '@/utils/hact/jobStatusUpdate/assignOperatives'
import OperativeForm from './OperativeForm'
import { sortOperativesWithPayrollFirst } from '@/utils/helpers/operatives'
import {
  getAppointmentDetails,
  getWorkOrderDetails,
} from '../../utils/requests/workOrders'
import { APIResponseError } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'
import { WorkOrder } from '../../models/workOrder'
import { CurrentUser } from '../../types/variations/types'
import { Operative } from '../../models/operativeModel'

interface Props {
  workOrderReference: string
}

const OperativeFormView = ({ workOrderReference }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  const [workOrder, setWorkOrder] = useState<WorkOrder>()

  const [currentUser, setCurrentUser] = useState<CurrentUser>()
  const [availableOperatives, setAvailableOperatives] = useState<Operative[]>(
    []
  )
  const [selectedOperatives, setSelectedOperatives] = useState<Operative[]>([])
  const [selectedPercentagesToShowOnEdit, setSelectedPercentagesToShowOnEdit] =
    useState([])

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
      setError(formatRequestErrorMessage(e))
      setLoading(false)
    }
  }

  const getOperatives = async (workOrderReference) => {
    setError(null)

    try {
      const currentUser: CurrentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setCurrentUser(currentUser)

      const workOrderResponse = await getWorkOrderDetails(workOrderReference)
      if (!workOrderResponse.success) throw workOrderResponse.error
      const workOrder = workOrderResponse.response

      setWorkOrder(workOrder)

      const appointmentDetailsResponse = await getAppointmentDetails(
        workOrderReference
      )
      if (!appointmentDetailsResponse.success)
        throw appointmentDetailsResponse.error
      const appointmentDetails = appointmentDetailsResponse.response

      const sortedOperatives = sortOperativesWithPayrollFirst(
        appointmentDetails.operatives,
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

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        if (e.response?.status === 404) {
          setError(
            `Could not find a work order with reference ${workOrderReference}`
          )
        } else {
          setError(formatRequestErrorMessage(e))
        }
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

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      {!workOrder && error && <ErrorMessage label={error} />}

      {workOrder && (
        <>
          <OperativeForm
            onSubmit={onSubmit}
            assignedOperativesToWorkOrder={selectedOperatives}
            availableOperatives={availableOperatives}
            selectedPercentagesToShowOnEdit={selectedPercentagesToShowOnEdit}
            totalSMV={workOrder.totalSMVs}
            currentUserPayrollNumber={currentUser.operativePayrollNumber}
          />
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default OperativeFormView
