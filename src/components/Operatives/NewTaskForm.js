import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { PrimarySubmitButton } from '../Form'
import BackButton from '../Layout/BackButton'
import RateScheduleItem from '../WorkElement/RateScheduleItem'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { buildVariationFormData } from '@/utils/hact/jobStatusUpdate/variation'
import { getWorkOrder } from '../../utils/requests/workOrders'
import { APIResponseError } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'

const NewTaskForm = ({ workOrderReference }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [currentUser, setCurrentUser] = useState({})
  const [sorCodes, setSorCodes] = useState([])
  const [existingTasks, setExistingTasks] = useState({})
  const { register, handleSubmit, errors } = useForm()
  const router = useRouter()

  const getNewTaskForm = async (reference) => {
    setError(null)

    try {
      const workOrderResponse = await getWorkOrder(reference)

      if (!workOrderResponse.success) {
        throw workOrderResponse.error
      }

      const workOrder = workOrderResponse.response

      const sorCodes = await frontEndApiRequest({
        path: '/api/schedule-of-rates/codes',
        method: 'get',
        params: {
          tradeCode: workOrder.tradeCode,
          propertyReference: workOrder.propertyReference,
          contractorReference: workOrder.contractorReference,
          showAdditionalTrades: true,
        },
      })

      setSorCodes(sorCodes)

      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setCurrentUser(currentUser)

      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      setExistingTasks(tasksAndSors)
    } catch (e) {
      setSorCodes([])

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        setError(formatRequestErrorMessage(e))
      }
    }

    setLoading(false)
  }

  const onFormSubmit = async (e) => {
    setLoading(true)

    const newTask = [
      {
        ...e.rateScheduleItems.operative,
        description: e.rateScheduleItems.operative.code.split(' - ')[1],
      },
    ]

    const workOrderUpdateFormData = buildVariationFormData(
      existingTasks,
      newTask,
      workOrderReference
    )

    try {
      await frontEndApiRequest({
        method: 'post',
        path: `/api/jobStatusUpdate`,
        requestData: workOrderUpdateFormData,
      })

      router.push(
        `/operatives/${currentUser?.operativePayrollNumber}/work-orders/${workOrderReference}`
      )
    } catch (e) {
      console.error(e)

      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setError(null)

    getNewTaskForm(workOrderReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <BackButton />
          {sorCodes && (
            <>
              <h1 className="lbh-heading-h2 govuk-!-margin-bottom-4">
                New SOR
              </h1>
              <form
                role="form"
                id="repair-request-form"
                onSubmit={handleSubmit(onFormSubmit)}
              >
                <RateScheduleItem
                  sorCodes={sorCodes}
                  register={register}
                  showRemoveRateScheduleItem={false}
                  removeRateScheduleIte={false}
                  errors={errors}
                  index={'operative'}
                />
                <div className="button-pair">
                  <PrimarySubmitButton
                    id="submit-work-order-task-add"
                    label="Confirm"
                  />
                </div>
              </form>
            </>
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default NewTaskForm
