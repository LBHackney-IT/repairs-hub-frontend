import PropTypes from 'prop-types'
import { WorkOrder } from '../../models/workOrder'
import OperativeWorkOrderDetails from './OperativeWorkOrderDetails'
import OperativeTasksAndSorsTable from '../WorkOrder/TasksAndSors/OperativeTasksAndSorsTable'
import WarningInfoBox from '../Template/WarningInfoBox'
import Link from 'next/link'
import { sortArrayByDate } from '../../utils/helpers/array'
import { areTasksUpdated } from '../../utils/tasks'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { CharacterCountLimitedTextArea, PrimarySubmitButton } from '../Form'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { buildWorkOrderUpdate } from '../../utils/hact/workOrderStatusUpdate/updateWorkOrder'
import ErrorMessage from '../Errors/ErrorMessage'
import router from 'next/router'

const OperativeWorkOrder = ({
  workOrderReference,
  property,
  workOrder,
  personAlerts,
  locationAlerts,
  tasksAndSors,
}) => {
  const operativesCount = workOrder.operatives.length
  const { register, errors, handleSubmit } = useForm()
  const [error, setError] = useState()

  const onFormSubmit = async (formData) => {
    try {
      await frontEndApiRequest({
        method: 'post',
        path: `/api/jobStatusUpdate`,
        requestData: buildWorkOrderUpdate(
          tasksAndSors,
          [],
          workOrderReference,
          formData.variationReason
        ),
      })

      router.push(`/work-orders/${workOrderReference}/close`)
    } catch (e) {
      console.error(e)

      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }
  }

  return (
    <>
      <OperativeWorkOrderDetails
        property={property}
        workOrder={workOrder}
        personAlerts={personAlerts}
        locationAlerts={locationAlerts}
        tasksAndSors={tasksAndSors}
      />

      <OperativeTasksAndSorsTable
        workOrderReference={workOrderReference}
        tasksAndSors={sortArrayByDate(tasksAndSors, 'dateAdded')}
        tabName={'Tasks and SORs'}
      />

      <WarningInfoBox
        header="Need to make a change?"
        text="Any changes to the work order must be made on paper."
      />

      <Link href={`/work-orders/${workOrderReference}/tasks/new`}>
        <a
          role="button"
          draggable="false"
          className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
          data-module="govuk-button"
        >
          Add new SOR
        </a>
      </Link>
      <br></br>
      {operativesCount === 1 && (
        <Link href={`/work-orders/${workOrderReference}/operatives/new`}>
          <a
            role="button"
            draggable="false"
            className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
            data-module="govuk-button"
          >
            Add operatives
          </a>
        </Link>
      )}
      <br></br>

      {error && <ErrorMessage label={error} />}

      {areTasksUpdated(tasksAndSors) ? (
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <CharacterCountLimitedTextArea
            name="variationReason"
            maxLength={250}
            requiredText="Please enter a reason"
            label="Variation reason"
            placeholder="Write a reason for the variation..."
            required={true}
            register={register}
            error={errors && errors.variationReason}
          />
          <PrimarySubmitButton label="Confirm" />
        </form>
      ) : (
        <Link href={`/work-orders/${workOrderReference}/close`}>
          <a
            role="button"
            draggable="false"
            className="govuk-button lbh-button"
            data-module="govuk-button"
          >
            Confirm
          </a>
        </Link>
      )}
    </>
  )
}

OperativeWorkOrder.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  property: PropTypes.object.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  personAlerts: PropTypes.array.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  tasksAndSors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      description: PropTypes.string,
      quantity: PropTypes.number,
      standardMinuteValue: PropTypes.number,
    })
  ).isRequired,
}

export default OperativeWorkOrder
