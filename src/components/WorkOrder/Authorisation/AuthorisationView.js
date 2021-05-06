import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import BackButton from '../../Layout/BackButton/BackButton'
import Radios from '../../Form/Radios/Radios'
import SuccessPage from '../../SuccessPage/SuccessPage'
import { TextArea, PrimarySubmitButton } from '../../Form'
import { postJobStatusUpdate } from '../../../utils/frontend-api-client/job-status-update'
import {
  buildAuthorisationApprovedFormData,
  buildAuthorisationRejectedFormData,
} from '../../../utils/hact/job-status-update/authorisation'

const AuthorisationView = ({ workOrderReference }) => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [authorisationApproved, setAuthorisationApproved] = useState(true)
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
      await postJobStatusUpdate(formData)

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

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!formSuccess && (
            <div>
              <BackButton />
              <h1 className="lbh-heading-l govuk-!-margin-right-6 govuk-!-margin-bottom-0">
                Authorisation request: {workOrderReference}{' '}
              </h1>
              <Link href={`/work-orders/${workOrderReference}`}>
                <a className="govuk-body-s">See works order</a>
              </Link>
              <br></br>
              <br></br>
              <form role="form" onSubmit={handleSubmit(onSubmitForm)}>
                <Radios
                  label="This job requires your authorisation"
                  name="options"
                  options={['Approve request', 'Reject request']}
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
                  ? 'You have approved the authorisation request for'
                  : 'You have rejected the authorisation request for'
              }
              showDashboardLink={true}
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
