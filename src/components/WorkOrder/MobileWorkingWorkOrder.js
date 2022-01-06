import PropTypes from 'prop-types'
import { WorkOrder } from '@/models/workOrder'
import MobileWorkingWorkOrderDetails from './MobileWorkingWorkOrderDetails'
import MobileWorkingTasksAndSorsTable from './TasksAndSors/MobileWorkingTasksAndSorsTable'
import WarningInfoBox from '../Template/WarningInfoBox'
import Link from 'next/link'
import { sortArrayByDate } from '@/utils/helpers/array'
import { areTasksUpdated } from '@/utils/tasks'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import {
  CharacterCountLimitedTextArea,
  PrimarySubmitButton,
  Checkbox,
} from '../Form'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { buildVariationFormData } from '@/utils/hact/jobStatusUpdate/variation'
import ErrorMessage from '../Errors/ErrorMessage'
import router from 'next/router'
import OperativeList from '../Operatives/OperativeList'
import { CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES } from '@/utils/statusCodes'
import AppointmentHeader from './AppointmentHeader'
import BackButton from '../Layout/BackButton'
import { isCurrentTimeOperativeOvertime } from '@/utils/helpers/completionDateTimes'

const MobileWorkingWorkOrder = ({
  workOrderReference,
  property,
  workOrder,
  personAlerts,
  locationAlerts,
  tasksAndSors,
  currentUserPayrollNumber,
}) => {
  const operativesCount = workOrder.operatives.length
  const readOnly = CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES.includes(
    workOrder.status
  )
  const { register, errors, handleSubmit } = useForm()
  const [error, setError] = useState()

  const onFormSubmit = async (formData) => {
    const isOvertime = formData.isOvertime || false

    try {
      if (formData.variationReason) {
        await frontEndApiRequest({
          method: 'post',
          path: `/api/jobStatusUpdate`,
          requestData: buildVariationFormData(
            tasksAndSors,
            [],
            workOrderReference,
            formData.variationReason
          ),
        })
      }

      router.push({
        pathname: `/operatives/${currentUserPayrollNumber}/work-orders/${workOrderReference}/close`,
        query: { isOvertime },
      })
    } catch (e) {
      console.error(e)

      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }
  }

  const renderOperativeManagementLink = (operativesCount) => {
    let path, linkText

    if (operativesCount <= 1) {
      path = 'new'
      linkText = 'Add operatives'
    } else {
      path = 'edit'
      linkText = 'Update operatives'
    }

    return (
      <>
        <Link href={`/work-orders/${workOrderReference}/operatives/${path}`}>
          <a
            role="button"
            draggable="false"
            className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
            data-module="govuk-button"
          >
            {linkText}
          </a>
        </Link>
        <br />
      </>
    )
  }

  return (
    <>
      <AppointmentHeader workOrder={workOrder} />
      <div className="govuk-!-margin-top-4">
        <BackButton />
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <MobileWorkingWorkOrderDetails
          property={property}
          workOrder={workOrder}
          personAlerts={personAlerts}
          locationAlerts={locationAlerts}
          tasksAndSors={tasksAndSors}
        />

        <MobileWorkingTasksAndSorsTable
          workOrderReference={workOrderReference}
          tasksAndSors={sortArrayByDate(tasksAndSors, 'dateAdded')}
          tabName={'Tasks and SORs'}
          readOnly={readOnly}
        />

        {process.env.NEXT_PUBLIC_CAN_CHOOSE_OVERTIME === 'true' &&
          isCurrentTimeOperativeOvertime() &&
          !readOnly && (
            <Checkbox
              className="govuk-!-margin-0"
              labelClassName="lbh-body-xs display-flex"
              name="isOvertime"
              label="Overtime work order"
              checked={workOrder.isOvertime}
              register={register}
              hintText="(SMVs not included in Bonus)"
            />
          )}

        {operativesCount > 1 && (
          <OperativeList
            operatives={workOrder.operatives}
            currentUserPayrollNumber={currentUserPayrollNumber}
            workOrderReference={workOrderReference}
            readOnly={readOnly}
          />
        )}

        {readOnly && (
          <>
            {workOrder.isOvertime && (
              <h4 className="lbh-heading-h4">Overtime work order</h4>
            )}
            <h4 className="lbh-heading-h4">Status</h4>
            <h5 className="lbh-heading-h5">{workOrder.status}</h5>
            <br />
          </>
        )}

        {!readOnly && (
          <>
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

            <br />

            {process.env.NEXT_PUBLIC_OPERATIVE_MANAGEMENT_MOBILE_ENABLED ===
              'true' && renderOperativeManagementLink(operativesCount)}

            {error && <ErrorMessage label={error} />}

            {areTasksUpdated(tasksAndSors) && (
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
            )}

            <PrimarySubmitButton label="Confirm" />
          </>
        )}
      </form>
    </>
  )
}

MobileWorkingWorkOrder.propTypes = {
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

export default MobileWorkingWorkOrder
