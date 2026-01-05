import { useEffect, useState } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import BackButton from '../../Layout/BackButton'
import Spinner from '../../Spinner'
import { useForm } from 'react-hook-form'
import { GridColumn, GridRow } from '../../Layout/Grid'
import { Button, PrimarySubmitButton, TextInput } from '../../Form'
import { buildVariationFormData } from '@/utils/hact/jobStatusUpdate/variation'
import { useRouter } from 'next/router'
import ErrorMessage from '../../Errors/ErrorMessage'
import AppointmentHeader from '../AppointmentHeader'
import { getWorkOrderDetails } from '@/root/src/utils/requests/workOrders'
import { APIResponseError } from '@/root/src/types/requests/types'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

const EditTaskForm = ({ workOrderReference, taskId }) => {
  const [tasks, setTasks] = useState({})
  const [task, setTask] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [workOrder, setWorkOrder] = useState({})

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const { register, errors, handleSubmit } = useForm()

  const onFormSubmit = async (quantity) => {
    setLoading(true)

    const latestTasks = tasks.map((task) => {
      return task.id === taskId ? { ...task, quantity: quantity } : task
    })

    const workOrderUpdateFormData = buildVariationFormData(
      latestTasks,
      [], // no new tasks
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

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const workOrderResponse = await getWorkOrderDetails(workOrderReference)

      if (!workOrderResponse.success) {
        throw workOrderResponse.error
      }

      const workOrder = workOrderResponse.response

      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setCurrentUser(currentUser)

      setWorkOrder(workOrder)

      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      setTasks(tasksAndSors)

      const taskToUpdate = tasksAndSors.find((task) => task.id === taskId)

      if (!taskToUpdate) {
        setError('No task found')
      }

      setTask(taskToUpdate)
    } catch (e) {
      console.error('An error has occured:', e.response)

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        setError(formatRequestErrorMessage(e))
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <AppointmentHeader workOrder={workOrder} />
      <BackButton />
      <h3 className="lbh-heading-h3">Update SOR</h3>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <form onSubmit={handleSubmit((data) => onFormSubmit(data.quantity))}>
            <GridRow>
              <GridColumn width="two-thirds">
                <p className="govuk-body-m">SOR Code and name</p>
                <p className="govuk-body-m">
                  {[task.code, task.description].filter(Boolean).join(' - ')}
                </p>
                <input
                  id="sor-id"
                  name="sor-id"
                  type="hidden"
                  value={task.id}
                  ref={register}
                />
              </GridColumn>
              <GridColumn width="one-third">
                <TextInput
                  name={'quantity'}
                  label="Quantity"
                  additionalDivClasses="update-task-quantity"
                  error={errors && errors?.['quantity']}
                  defaultValue={task.quantity}
                  register={register({
                    required: 'Please enter a quantity',
                    validate: (value) => {
                      const maxTwoDecimalPoints = /^(?=.*\d)\d*(?:\.\d{1,2})?$/
                      if (isNaN(value)) {
                        return 'Quantity must be a number'
                      } else if (value < 0) {
                        return 'Quantity must be 0 or more'
                      } else if (!maxTwoDecimalPoints.test(value)) {
                        return 'Quantity including a decimal point is permitted a maximum of 2 decimal places'
                      } else {
                        return true
                      }
                    },
                  })}
                />
              </GridColumn>
            </GridRow>
            <Button
              isSecondary={true}
              onClick={() => onFormSubmit(0)}
              label="Remove SOR"
              className="govuk-!-margin-top-9"
            ></Button>
            <PrimarySubmitButton
              label="Confirm"
              className="govuk-!-margin-top-0"
            />
          </form>

          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default EditTaskForm
