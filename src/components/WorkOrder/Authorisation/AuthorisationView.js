import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import BackButton from '../../Layout/BackButton'
import Radios from '../../Form/Radios'
import SuccessPage from '../../SuccessPage/index'
import WarningText from '../../Template/WarningText'
import { TextArea, PrimarySubmitButton } from '../../Form'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import {
  buildAuthorisationApprovedFormData,
  buildAuthorisationRejectedFormData,
} from '@/utils/hact/jobStatusUpdate/authorisation'
import { calculateTotal } from '@/utils/helpers/calculations'
import PageAnnouncement from '@/components/Template/PageAnnouncement'
import Panel from '@/components/Template/Panel'
import {
  authorisationApprovedLinks,
  cancelWorkOrderLinks,
} from '@/utils/successPageLinks'
import { getWorkOrderDetails } from '@/root/src/utils/requests/workOrders'
import { APIResponseError } from '@/root/src/types/requests/types'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

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
  const [shortAddress, setShortAddress] = useState()

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
      setError(formatRequestErrorMessage(e))
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
      const workOrderResponse = await getWorkOrderDetails(workOrderReference)

      if (!workOrderResponse.success) {
        throw workOrderResponse.error
      }

      const workOrder = workOrderResponse.response

      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })
      const user = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })
      setShortAddress(workOrder.property)
      setRaiseSpendLimit(parseFloat(user.raiseLimit))

      const totalCost = calculateTotal(tasksAndSors, 'cost', 'quantity')

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

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        setError(formatRequestErrorMessage(e))
      }
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
              <Link href={`/work-orders/${workOrderReference}`} legacyBehavior>
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
              banner={
                authorisationApproved ? (
                  <PageAnnouncement
                    title="Authorisation request approved"
                    workOrderReference={workOrderReference}
                  />
                ) : (
                  <Panel
                    title="Work order cancelled, authorisation request rejected"
                    workOrderReference={workOrderReference}
                  />
                )
              }
              links={
                authorisationApproved
                  ? authorisationApprovedLinks(workOrderReference)
                  : cancelWorkOrderLinks(
                      workOrderReference,
                      propertyReference,
                      shortAddress
                    )
              }
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
