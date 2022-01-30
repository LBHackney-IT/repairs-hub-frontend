import PropTypes from 'prop-types'
import { WorkOrder } from '@/models/workOrder'
import MobileWorkingWorkOrderDetails from './MobileWorkingWorkOrderDetails'
import MobileWorkingTasksAndSorsTable from './TasksAndSors/MobileWorkingTasksAndSorsTable'
import Link from 'next/link'
import { sortArrayByDate } from '@/utils/helpers/array'
import { areTasksUpdated } from '@/utils/tasks'
import { useForm } from 'react-hook-form'
import Radios from '@/components/Form/Radios'
import { CharacterCountLimitedTextArea, PrimarySubmitButton } from '../Form'
import OperativeList from '../Operatives/OperativeList'
import { CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES } from '@/utils/statusCodes'
import AppointmentHeader from './AppointmentHeader'
import BackButton from '../Layout/BackButton'
import { isCurrentTimeOperativeOvertime } from '@/utils/helpers/completionDateTimes'
import {
  BONUS_PAYMENT_TYPE,
  OVERTIME_PAYMENT_TYPE,
  PAYMENT_TYPE_FORM_DESCRIPTIONS,
} from '@/utils/paymentTypes'

const MobileWorkingWorkOrder = ({
  workOrderReference,
  property,
  workOrder,
  personAlerts,
  locationAlerts,
  tasksAndSors,
  onFormSubmit,
  currentUserPayrollNumber,
  paymentType,
}) => {
  const operativesCount = workOrder.operatives.length
  const readOnly = CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES.includes(
    workOrder.status
  )
  const { register, errors, handleSubmit } = useForm()

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
      <div className="govuk-!-margin-top-0">
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
      </div>
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

        {isCurrentTimeOperativeOvertime() && !readOnly && (
          <Radios
            label="Payment type"
            name="paymentType"
            options={[
              {
                text: PAYMENT_TYPE_FORM_DESCRIPTIONS[BONUS_PAYMENT_TYPE],
                value: BONUS_PAYMENT_TYPE,
                defaultChecked:
                  !paymentType || paymentType === BONUS_PAYMENT_TYPE,
              },
              {
                text: PAYMENT_TYPE_FORM_DESCRIPTIONS[OVERTIME_PAYMENT_TYPE],
                value: OVERTIME_PAYMENT_TYPE,
                defaultChecked: paymentType === OVERTIME_PAYMENT_TYPE,
              },
            ]}
            register={register({
              required: 'Provide payment type',
            })}
            error={errors && errors.paymentType}
          />
        )}

        {readOnly && (
          <>
            {workOrder.paymentType === OVERTIME_PAYMENT_TYPE && (
              <h4 className="lbh-heading-h4">Overtime work order</h4>
            )}
            <h4 className="lbh-heading-h4">Status</h4>
            <h5 className="lbh-heading-h5">{workOrder.status}</h5>
            <br />
          </>
        )}

        {!readOnly && (
          <>
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

            <div className="govuk-!-margin-top-0">
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
            </div>

            {operativesCount > 1 && (
              <OperativeList
                operatives={workOrder.operatives}
                currentUserPayrollNumber={currentUserPayrollNumber}
                workOrderReference={workOrderReference}
                readOnly={readOnly}
              />
            )}

            {process.env.NEXT_PUBLIC_OPERATIVE_MANAGEMENT_MOBILE_ENABLED ===
              'true' && renderOperativeManagementLink(operativesCount)}

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
  onFormSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  currentUserPayrollNumber: PropTypes.string.isRequired,
}

export default MobileWorkingWorkOrder
