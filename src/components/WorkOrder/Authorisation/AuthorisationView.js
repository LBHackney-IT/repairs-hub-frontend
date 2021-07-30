import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import BackButton from '../../Layout/BackButton/BackButton'
import Radios from '../../Form/Radios/Radios'
import SuccessPage from '../../SuccessPage/SuccessPage'
import WarningText from '../../Template/WarningText'
import { TextArea, PrimarySubmitButton } from '../../Form'
import { frontEndApiRequest } from '../../../utils/frontEndApiClient/requests'
import {
  buildAuthorisationApprovedFormData,
  buildAuthorisationRejectedFormData,
} from '../../../utils/hact/jobStatusUpdate/authorisation'
import { calculateTotalCost } from '../../../utils/helpers/calculations'
import { WorkOrder } from '../../../models/workOrder'

const AuthorisationView = ({ workOrderReference }) => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [authorisationApproved, setAuthorisationApproved] = useState(true)
  const [raiseSpendLimit, setRaiseSpendLimit] = useState()
  const [overSpendLimit, setOverSpendLimit] = useState()
  const [targetDatePassed, setTargetDatePassed] = useState()
  const [propertyReference, setPropertyReference] = useState()
  const [formActions, setFormActions] = useState([
    'Approve request',
    'Reject request',
  ])
  const { handleSubmit, register, errors } = useForm({
    mode: 'onChange',
  })

  const onSubmitForm = (e) => {
    const formData =
      e.options == 'Approve request'
        ? buildAuthorisationApprovedFormData(workOrderReference)
        : buildAuthorisationRejectedFormData(e, workOrderReference)

    onFormSubmit(formData)
  }

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      frontEndApiRequest({
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

  const displayNotes = (e) => {
    e.target.value == 'Reject request'
      ? setAuthorisationApproved(false)
      : setAuthorisationApproved(true)
  }

  const requestTasksAndSors = async (workOrderReference) => {
    setError(null)

    try {
      const workOrderData = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
      })
      const workOrder = new WorkOrder(workOrderData)

      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })
      const user = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setRaiseSpendLimit(parseFloat(user.raiseLimit))

      const totalCost = calculateTotalCost(tasksAndSors, 'cost', 'quantity')

      if (totalCost.toFixed(2) > parseFloat(user.raiseLimit)) {
        setOverSpendLimit(true)
        setFormActions(['Reject request'])
      }

      if (workOrder.targetTimePassed()) {
        setTargetDatePassed(true)
        setPropertyReference(workOrder.propertyReference)
        setFormActions(['Reject request'])
      }
    } catch (e) {
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    requestTasksAndSors(workOrderReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!formSuccess && (
            <div>
              <BackButton />
              <h1 className="lbh-heading-h1 govuk-!-margin-right-6 govuk-!-margin-bottom-0">
                Authorisation request: {workOrderReference}{' '}
              </h1>
              <Link href={`/work-orders/${workOrderReference}`}>
                <a className="lbh-link">See work order</a>
              </Link>
              <br></br>
              <br></br>

              {overSpendLimit && (
                <WarningText
                  text={`Work order is over your raise limit of £${raiseSpendLimit}, please contact a manager to approve. You can still reject the authorisation request.`}
                />
              )}

              {targetDatePassed && (
                <WarningText
                  text={`Work order cannot be approved, the target date has expired. Please reject and raise a new work order.`}
                />
              )}

              <form role="form" onSubmit={handleSubmit(onSubmitForm)}>
                <Radios
                  label="This work order requires your authorisation"
                  name="options"
                  options={formActions}
                  onChange={displayNotes}
                  register={register({
                    required: 'Please select a process',
                  })}
                  error={errors && errors.options}
                />
                {!authorisationApproved && (
                  <TextArea
                    name="note"
                    label="Add notes"
                    register={register({
                      required: 'Please add notes',
                    })}
                    error={errors && errors.note}
                  />
                )}
                <PrimarySubmitButton label="Submit" />
              </form>
              {error && <ErrorMessage label={error} />}
            </div>
          )}
          {formSuccess && (
            <SuccessPage
              workOrderReference={workOrderReference}
              text={
                authorisationApproved
                  ? 'You have approved the authorisation request'
                  : 'You have rejected the authorisation request'
              }
              showDashboardLink={true}
              showNewWorkOrderLink={targetDatePassed}
              propertyReference={propertyReference}
            />
          )}
        </>
      )}
    </>
  )
}

AuthorisationView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default AuthorisationView
