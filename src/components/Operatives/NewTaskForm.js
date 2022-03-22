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

const NewTaskForm = ({ workOrderReference }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [currentUser, setCurrentUser] = useState({})
  const [workOrder, setWorkOrder] = useState([])
  const [sorCodes, setSorCodes] = useState([])
  const [existingTasks, setExistingTasks] = useState({})
  const { register, handleSubmit, errors } = useForm()
  const router = useRouter()

  const sorSearchRequest = (searchText) =>
    frontEndApiRequest({
      method: 'get',
      path: '/api/schedule-of-rates/codes',
      params: {
        tradeCode: workOrder.tradeCode,
        propertyReference: workOrder.propertyReference,
        contractorReference: workOrder.contractorReference,
        showAdditionalTrades:
          process.env.NEXT_PUBLIC_UPDATING_MULTI_TRADES_ENABLED === 'true',
        q: searchText,
      },
    })

  const getNewTaskForm = async (reference) => {
    setError(null)

    try {
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${reference}`,
      })

      setWorkOrder(workOrder)

      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setCurrentUser(currentUser)

      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${reference}/tasks`,
      })

      setExistingTasks(tasksAndSors)
    } catch (e) {
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
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

      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
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

          <>
            <h1 className="lbh-heading-h2 govuk-!-margin-bottom-4">New SOR</h1>
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
                sorSearchRequest={sorSearchRequest}
                setSorCodes={setSorCodes}
              />
              <div className="button-pair">
                <PrimarySubmitButton label="Confirm" />
              </div>
            </form>
          </>

          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default NewTaskForm
