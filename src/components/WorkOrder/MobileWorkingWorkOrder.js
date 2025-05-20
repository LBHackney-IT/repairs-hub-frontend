import PropTypes from 'prop-types'
import { WorkOrder } from '@/models/workOrder'
import MobileWorkingWorkOrderDetails from './MobileWorkingWorkOrderDetails'
import MobileWorkingTasksAndSorsTable from './TasksAndSors/MobileWorkingTasksAndSorsTable'
import Link from 'next/link'
import { sortArrayByDate } from '@/utils/helpers/array'
import { useForm } from 'react-hook-form'
import Radios from '@/components/Form/Radios'
import { Button, PrimarySubmitButton } from '../Form'
import OperativeList from '../Operatives/OperativeList'
import { CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES } from '@/utils/statusCodes'
import AppointmentHeader from './AppointmentHeader'
import BackButton from '../Layout/BackButton'
import { isCurrentTimeOperativeOvertime } from '@/utils/helpers/completionDateTimes'
import {
  BONUS_PAYMENT_TYPE,
  OVERTIME_PAYMENT_TYPE,
  optionsForPaymentType,
} from '@/utils/paymentTypes'
import Status from './Status'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { useState } from 'react'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import PhotoViewList from './Photos/PhotoViewList'
import WarningInfoBox from '../Template/WarningInfoBox'

const VARIATION_PENDING_APPROVAL_STATUS = 'Variation Pending Approval'

const TempDisabledButton = ({ disabled, text, href, className }) => {
  return (
    <>
      {disabled ? (
        <button className={className} disabled>
          {text}
        </button>
      ) : (
        <Link href={href}>
          <a
            role="button"
            draggable="false"
            className={className}
            data-module="govuk-button"
          >
            {text}
          </a>
        </Link>
      )}
    </>
  )
}

const MobileWorkingWorkOrder = ({
  workOrderReference,
  property,
  workOrder,
  tasksAndSors,
  onFormSubmit,
  currentUserPayrollNumber,
  paymentType,
  tenure,
  photos,
}) => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const handleStartJob = async () => {
    setError(null)
    setLoading(true)

    const startTime = new Date()

    const requestData = {
      startTime,
      workOrderId: workOrderReference,
    }

    frontEndApiRequest({
      method: 'put',
      path: `/api/workOrders/starttime`,
      requestData,
    })
      .then(() => {
        // update clientSide
        workOrder.startTime = startTime
      })
      .catch((e) => {
        console.error(e)

        setError(
          `Oops an error occurred with error status: ${
            e.response?.status
          } with message: ${JSON.stringify(e.response?.data?.message)}`
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const operativesCount = workOrder.operatives.length
  const readOnly = CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES.includes(
    workOrder.status
  )
  const { register, errors, handleSubmit } = useForm()

  const isVariationPendingApprovalStatus =
    workOrder?.status === VARIATION_PENDING_APPROVAL_STATUS

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <AppointmentHeader workOrder={workOrder} />
          <div className="govuk-!-margin-top-4">
            <BackButton />
          </div>

          {error && (
            <div>
              <ErrorMessage label={error} />
            </div>
          )}

          <form onSubmit={handleSubmit(onFormSubmit)}>
            <MobileWorkingWorkOrderDetails
              property={property}
              workOrder={workOrder}
              tasksAndSors={tasksAndSors}
              tenure={tenure}
            />

            {photos.length > 0 && (
              <>
                <h2 className="lbh-heading-h2">Photos</h2>

                <PhotoViewList photos={photos} />
              </>
            )}

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
                labelSize="s"
                options={optionsForPaymentType({
                  paymentTypes: [BONUS_PAYMENT_TYPE, OVERTIME_PAYMENT_TYPE],
                  currentPaymentType: paymentType,
                })}
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
                {operativesCount > 1 && (
                  <OperativeList
                    operatives={workOrder.operatives}
                    currentUserPayrollNumber={currentUserPayrollNumber}
                    workOrderReference={workOrderReference}
                    readOnly={readOnly}
                  />
                )}
                <h4 className="lbh-heading-h4">Status</h4>
                <Status
                  text={workOrder.status}
                  className="work-order-status govuk-!-margin-top-2"
                />
                <br />
              </>
            )}

            {!readOnly && (
              <>
                <div className="govuk-!-margin-top-0">
                  <TempDisabledButton
                    className="govuk-button govuk-secondary lbh-button lbh-button--secondary "
                    disabled={isVariationPendingApprovalStatus}
                    href={`/operatives/${currentUserPayrollNumber}/work-orders/${workOrderReference}/tasks/new`}
                    text={'Update SOR codes'}
                  />
                </div>

                {operativesCount > 1 && (
                  <OperativeList
                    operatives={workOrder.operatives}
                    currentUserPayrollNumber={currentUserPayrollNumber}
                    workOrderReference={workOrderReference}
                    readOnly={readOnly}
                  />
                )}

                <div className="govuk-!-margin-top-0">
                  <TempDisabledButton
                    className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
                    disabled={isVariationPendingApprovalStatus}
                    href={`/work-orders/${workOrderReference}/operatives/${
                      operativesCount <= 1 ? 'new' : 'edit'
                    }`}
                    text={`${
                      operativesCount <= 1 ? 'Add' : 'Update'
                    } operatives`}
                  />
                </div>

                {isVariationPendingApprovalStatus && (
                  <>
                    <br></br>
                    <WarningInfoBox
                      className="variant-warning"
                      header="Work order cannot be closed"
                      name="approvalWarning"
                      text="Variation approval is pending. Please contact your manager to approve the variation to the work order."
                    />
                  </>
                )}

                {workOrder?.startTime ? (
                  <PrimarySubmitButton
                    id="submit-work-order-details-confirm"
                    label="Confirm"
                    disabled={isVariationPendingApprovalStatus}
                  />
                ) : (
                  <div className="govuk-form-group lbh-form-group">
                    <Button
                      type="button"
                      onClick={handleStartJob}
                      label="Start my job"
                    />
                  </div>
                )}
              </>
            )}
          </form>
        </>
      )}
    </>
  )
}

MobileWorkingWorkOrder.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  property: PropTypes.object.isRequired,
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
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
  tenure: PropTypes.object,
}

export default MobileWorkingWorkOrder
