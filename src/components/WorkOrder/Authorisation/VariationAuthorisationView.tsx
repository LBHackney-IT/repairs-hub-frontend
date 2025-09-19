import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { useState, useEffect } from 'react'
import BackButton from '../../Layout/BackButton'
import Radios from '../../Form/Radios'
import { TextArea, PrimarySubmitButton } from '../../Form'
import {
  buildVariationAuthorisationApprovedFormData,
  buildVariationAuthorisationRejectedFormData,
} from '@/utils/hact/jobStatusUpdate/authorisation'
import SuccessPage from '../../SuccessPage/index'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import VariationAuthorisationSummary from './VariationAuthorisationSummary'
import WarningText from '../../Template/WarningText'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { calculateTotalVariedCost } from '@/utils/helpers/calculations'
import PageAnnouncement from '@/components/Template/PageAnnouncement'
import { rejectLinks, generalLinks } from '@/utils/successPageLinks'
import {
  Variation,
  VariationResponseObject,
} from '../../../types/variations/types'
import { getWorkOrderDetails } from '@/root/src/utils/requests/workOrders'
import { WorkOrder } from '@/root/src/models/workOrder'
import { APIResponseError } from '@/root/src/types/requests/types'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

const APPROVE_REQUEST = 'Approve request'
const REJECT_REQUEST = 'Reject request'

interface Props {
  workOrderReference: string
}

const VariationAuthorisationView = ({ workOrderReference }: Props) => {
  const [error, setError] = useState<string | null>()
  const [loading, setLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [variation, setVariation] = useState<Variation | null>(null)
  const [originalSors, setOriginalSors] = useState([])
  const [varySpendLimit, setVarySpendLimit] = useState<number>()
  const [overSpendLimit, setOverSpendLimit] = useState<boolean | null>(null)
  const [totalCostAfterVariation, setTotalCostAfterVariation] = useState()
  const [formActions, setFormActions] = useState([
    APPROVE_REQUEST,
    REJECT_REQUEST,
  ])
  const [showSummary, setShowSummary] = useState(false)
  const [rejectionReasonToShow, setRejectionReasonToShow] = useState('')
  const [budgetCode, setBudgetCode] = useState()
  const [selectedOption, setSelectedOption] = useState('')
  const { handleSubmit, register, errors } = useForm({
    mode: 'onChange',
  })
  const [workOrder, setWorkOrder] = useState<WorkOrder>(null)

  const requestVariationTasks = async (workOrderReference) => {
    setError(null)

    try {
      const workOrderResponse = await getWorkOrderDetails(workOrderReference)

      if (!workOrderResponse.success) {
        throw workOrderResponse.error
      }

      const workOrder = workOrderResponse.response

      const variationResponse: VariationResponseObject =
        await frontEndApiRequest({
          method: 'get',
          path: `/api/workOrders/${workOrderReference}/variation-tasks`,
        })

      const user = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setVariation(variationResponse.variation)
      setBudgetCode(workOrder.budgetCode)
      setVarySpendLimit(parseFloat(user.varyLimit))
      setWorkOrder(() => workOrder)

      const totalCostAfterVariation = calculateTotalVariedCost(
        variationResponse.variation.tasks
      )
      setTotalCostAfterVariation(totalCostAfterVariation)

      if (totalCostAfterVariation.toFixed(2) > parseFloat(user.varyLimit)) {
        setOverSpendLimit(true)
        setFormActions([REJECT_REQUEST])
      }
    } catch (e) {
      setVariation(null)
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

  const getTasksAndSorsView = async (workOrderReference) => {
    setError(null)

    try {
      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      setOriginalSors(tasksAndSors.filter((t) => t.original))
    } catch (e) {
      setOriginalSors(null)
      console.error('An error has occured:', e.response)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  const onSubmitForm = (e) => {
    if (!showSummary && selectedOption === REJECT_REQUEST) {
      setShowSummary(true)
      setRejectionReasonToShow(e.note)
    } else {
      if (!e.note) {
        e.note = rejectionReasonToShow
      }
      const formData =
        e.options == APPROVE_REQUEST
          ? buildVariationAuthorisationApprovedFormData(workOrderReference)
          : buildVariationAuthorisationRejectedFormData(e, workOrderReference)

      makePostRequest(formData)
    }
  }

  const makePostRequest = async (formData) => {
    setLoading(true)
    try {
      await frontEndApiRequest({
        method: 'post',
        path: `/api/jobStatusUpdate`,
        requestData: formData,
      })
      setFormSuccess(true)
    } catch (e) {
      console.error(e)
      setError(formatRequestErrorMessage(e))
    }
    setLoading(false)
  }

  const addNotes = (e) => {
    setSelectedOption(e.target.value)
  }

  useEffect(() => {
    setLoading(true)

    requestVariationTasks(workOrderReference)
    getTasksAndSorsView(workOrderReference)
  }, [])

  const showEditPage = (e) => {
    e.preventDefault()
    setShowSummary(false)
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!formSuccess &&
            variation?.tasks &&
            originalSors &&
            totalCostAfterVariation &&
            !isNaN(varySpendLimit) && (
              <div>
                <BackButton />
                <h1 className="lbh-heading-h1 govuk-!-margin-right-6 govuk-!-margin-bottom-0">
                  Authorisation variation request: {workOrderReference}{' '}
                </h1>
                <Link href={`/work-orders/${workOrderReference}`}>
                  <a className="lbh-link">See work order</a>
                </Link>
                <VariationAuthorisationSummary
                  variationTasks={variation}
                  originalSors={originalSors}
                  totalCostAfterVariation={totalCostAfterVariation}
                  budgetCode={budgetCode}
                />
                <br></br>
                <br></br>

                {!showSummary && overSpendLimit && (
                  <WarningText
                    text={`Work order is over your vary limit of £${varySpendLimit}, please contact a manager to approve. You can still reject the variation request.`}
                  />
                )}

                <form role="form" onSubmit={handleSubmit(onSubmitForm)}>
                  {!showSummary && (
                    <Radios
                      label="This work order requires your authorisation"
                      name="options"
                      options={formActions.map((action) => {
                        return {
                          text: action,
                          value: action,
                          defaultChecked: action === selectedOption,
                        }
                      })}
                      onChange={addNotes}
                      register={register({
                        required: 'Please select a process',
                      })}
                      error={errors && errors.options}
                    />
                  )}

                  {selectedOption === APPROVE_REQUEST && !showSummary && (
                    <PrimarySubmitButton
                      id="submit-variation-request-approve"
                      label="Submit"
                    />
                  )}

                  {selectedOption === REJECT_REQUEST && !showSummary && (
                    <>
                      <TextArea
                        name="note"
                        label="Add notes"
                        register={register({
                          required: 'Please add notes',
                        })}
                        error={errors && errors.note}
                        defaultValue={rejectionReasonToShow}
                      />

                      <PrimarySubmitButton
                        id="submit-variation-request-reject"
                        label="Continue"
                      />
                    </>
                  )}

                  {showSummary && (
                    <>
                      <h3 className="lbh-heading-h3">
                        You are rejecting the variation request
                      </h3>
                      <div className="lbh-stat">
                        <span className="lbh-stat__caption">
                          {rejectionReasonToShow}
                          <Link href="#">
                            <a
                              onClick={showEditPage}
                              className="float-right govuk-!-margin-top-3 lbh-link"
                            >
                              Edit rejection reason(s)
                            </a>
                          </Link>
                        </span>
                      </div>
                      <PrimarySubmitButton
                        id="submit-variation-request-rejection-reason"
                        label="Submit"
                      />
                    </>
                  )}
                </form>

                {error && <ErrorMessage label={error} />}
              </div>
            )}

          {formSuccess && (
            <SuccessPage
              banner={
                <PageAnnouncement
                  title={
                    selectedOption === APPROVE_REQUEST
                      ? 'Variation request approved'
                      : 'Variation request rejected'
                  }
                  workOrderReference={workOrderReference}
                />
              }
              links={
                selectedOption === APPROVE_REQUEST
                  ? generalLinks(workOrderReference)
                  : rejectLinks(
                      workOrderReference,
                      workOrder?.propertyReference,
                      workOrder?.property
                    )
              }
            />
          )}
        </>
      )}
    </>
  )
}

export default VariationAuthorisationView
