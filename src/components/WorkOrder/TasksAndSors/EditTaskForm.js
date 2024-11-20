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

      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${JSON.stringify(e.response?.data?.message)}`
      )
    }

    setLoading(false)
  }

  useEffect(async () => {
    setLoading(true)
    setError(null)

    try {
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
      })

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

      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${JSON.stringify(e.response?.data?.message)}`
      )
    }

    setLoading(false)
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
