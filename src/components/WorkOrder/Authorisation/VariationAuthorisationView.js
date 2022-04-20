import PropTypes from 'prop-types'
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
import SuccessPage from '../../SuccessPage'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import VariationAuthorisationSummary from './VariationAuthorisationSummary'
import WarningText from '../../Template/WarningText'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { calculateTotalVariedCost } from '@/utils/helpers/calculations'
import { PURDY_CONTRACTOR_REFERENCE } from '@/utils/constants'

const VariationAuthorisationView = ({ workOrderReference }) => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [variationApproved, setVariationApproved] = useState(true)
  const [confirmationPageMessage, setConfirmationPageMessage] = useState('')
  const [variationTasks, setVariationTasks] = useState({})
  const [originalSors, setOriginalSors] = useState([])
  const [varySpendLimit, setVarySpendLimit] = useState()
  const [overSpendLimit, setOverSpendLimit] = useState()
  const [totalCostAfterVariation, setTotalCostAfterVariation] = useState()
  const [formActions, setFormActions] = useState([
    'Approve request',
    'Reject request',
  ])
  const [showSummary, setShowSummary] = useState(false)
  const [contractorIsPurdy, setContractorIsPurdy] = useState(false)
  const [rejectionReasonToShow, setRejectionReasonToShow] = useState('')
  const [budgetCode, setBudgetCode] = useState()
  const { handleSubmit, register, errors } = useForm({
    mode: 'onChange',
  })

  const requestVariationTasks = async (workOrderReference) => {
    setError(null)

    try {
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
      })

      const variationTasks = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/variation-tasks`,
      })

      const user = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setVariationTasks(variationTasks)
      setBudgetCode(workOrder.budgetCode)
      setContractorIsPurdy(
        workOrder.contractorReference === PURDY_CONTRACTOR_REFERENCE
      )
      setVarySpendLimit(parseFloat(user.varyLimit))

      const totalCostAfterVariation = calculateTotalVariedCost(
        variationTasks.tasks
      )
      setTotalCostAfterVariation(totalCostAfterVariation)

      if (totalCostAfterVariation.toFixed(2) > parseFloat(user.varyLimit)) {
        setOverSpendLimit(true)
        setFormActions(['Reject request'])
      }
    } catch (e) {
      setVariationTasks(null)
      console.error('An error has occured:', e.response)
      if (e.response?.status === 404) {
        setError(
          `Could not find a work order with reference ${workOrderReference}`
        )
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
        )
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
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  const onSubmitForm = (e) => {
    if (contractorIsPurdy && !showSummary) {
      setShowSummary(true)
      setRejectionReasonToShow(e.note)
    } else {
      if (!e.note) {
        e.note = rejectionReasonToShow
      }
      const formData =
        e.options == 'Approve request'
          ? buildVariationAuthorisationApprovedFormData(workOrderReference)
          : buildVariationAuthorisationRejectedFormData(e, workOrderReference)
      addConfirmationText()
      makePostRequest(formData)
    }
  }

  const addConfirmationText = () => {
    variationApproved
      ? setConfirmationPageMessage('You have approved a variation')
      : setConfirmationPageMessage('You have rejected a variation')
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
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }
    setLoading(false)
  }

  const addNotes = (e) => {
    e.target.value == 'Reject request'
      ? setVariationApproved(false)
      : setVariationApproved(true)
  }

  useEffect(() => {
    setLoading(true)

    requestVariationTasks(workOrderReference)
    getTasksAndSorsView(workOrderReference)
  }, [])

  const changeStatus = (e) => {
    e.preventDefault()
    setShowSummary(false)
    console.log(e.target.value)
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!formSuccess &&
            variationTasks.tasks &&
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
                  variationTasks={variationTasks}
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
                          defaultChecked: !variationApproved,
                        }
                      })}
                      onChange={addNotes}
                      register={register({
                        required: 'Please select a process',
                      })}
                      error={errors && errors.options}
                    />
                  )}
                  {!variationApproved && !showSummary && (
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
                      {contractorIsPurdy && !showSummary && (
                        <PrimarySubmitButton label="Continue" />
                      )}
                    </>
                  )}

                  {contractorIsPurdy && showSummary && (
                    <>
                      <h3 className="lbh-heading-h3">
                        You are rejecting the variation request
                      </h3>
                      <div className="lbh-stat">
                        <span className="lbh-stat__caption">
                          {rejectionReasonToShow}
                          <Link href="#">
                            <a
                              onClick={changeStatus}
                              className="float-right govuk-!-margin-top-3 lbh-link"
                            >
                              Edit rejection reason(s)
                            </a>
                          </Link>
                        </span>
                      </div>
                    </>
                  )}

                  {(!contractorIsPurdy || showSummary) && (
                    <PrimarySubmitButton label="Submit" />
                  )}
                </form>
                {error && <ErrorMessage label={error} />}
              </div>
            )}
          {formSuccess && (
            <SuccessPage
              workOrderReference={workOrderReference}
              text={confirmationPageMessage}
              showDashboardLink={true}
            />
          )}
        </>
      )}
    </>
  )
}

VariationAuthorisationView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default VariationAuthorisationView
