import { WorkOrder } from '@/models/workOrder'
import MobileWorkingWorkOrderDetails from './MobileWorkingWorkOrderDetails'
import MobileWorkingTasksAndSorsTable from './TasksAndSors/MobileWorkingTasksAndSorsTable'
import Link from 'next/link'
import { sortArrayByDate } from '@/utils/helpers/array'
import { areTasksUpdated } from '@/utils/tasks'
import { useForm } from 'react-hook-form'
import Radios from '@/components/Form/Radios'
import {
  Button,
  CharacterCountLimitedTextArea,
  PrimarySubmitButton,
} from '../Form'
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
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'
import { Property, Tenure } from '../../models/propertyTenure'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

const VARIATION_PENDING_APPROVAL_STATUS = 'Variation Pending Approval'

interface Props {
  workOrderReference: string
  property: Property
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
  tasksAndSors: {
    code: string
    description: string
    quantity: number
    standardMinuteValue: number
  }[]
  onFormSubmit: (formData: any) => Promise<void>
  error?: string
  currentUserPayrollNumber: string
  tenure: Tenure
  paymentType: string
  photos: object[]
}

const MobileWorkingWorkOrder = (props: Props) => {
  const {
    workOrderReference,
    property,
    workOrder,
    appointmentDetails,
    tasksAndSors,
    onFormSubmit,
    currentUserPayrollNumber,
    paymentType,
    tenure,
    photos,
  } = props

  const [error, setError] = useState<string | null>()
  const [loading, setLoading] = useState<boolean>(false)

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
        workOrder.startTime = startTime.toISOString()
      })
      .catch((e) => {
        console.error(e)

        setError(formatRequestErrorMessage(e))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const operativesCount = appointmentDetails.operatives.length
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
          <AppointmentHeader appointment={appointmentDetails?.appointment} />
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
              appointmentDetails={appointmentDetails}
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
                    operatives={appointmentDetails.operatives}
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
                  {isVariationPendingApprovalStatus ? (
                    <button
                      disabled
                      type="button"
                      className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
                    >
                      Add new SOR
                    </button>
                  ) : (
                    <Link
                      href={`/work-orders/${workOrderReference}/tasks/new`}
                      legacyBehavior
                    >
                      <a
                        role="button"
                        draggable="false"
                        className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
                        data-module="govuk-button"
                      >
                        Add new SOR
                      </a>
                    </Link>
                  )}
                </div>

                {operativesCount > 1 && (
                  <OperativeList
                    operatives={appointmentDetails.operatives}
                    currentUserPayrollNumber={currentUserPayrollNumber}
                    workOrderReference={workOrderReference}
                    readOnly={readOnly}
                  />
                )}

                <div className="govuk-!-margin-top-0">
                  {isVariationPendingApprovalStatus ? (
                    <button
                      disabled
                      type="button"
                      className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
                    >
                      {operativesCount <= 1 ? 'Add' : 'Update'} operatives
                    </button>
                  ) : (
                    <Link
                      href={`/work-orders/${workOrderReference}/operatives/${
                        operativesCount <= 1 ? 'new' : 'edit'
                      }`}
                      legacyBehavior
                    >
                      <a
                        role="button"
                        draggable="false"
                        className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
                        data-module="govuk-button"
                      >
                        {operativesCount <= 1 ? 'Add' : 'Update'} operatives
                      </a>
                    </Link>
                  )}
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

export default MobileWorkingWorkOrder
