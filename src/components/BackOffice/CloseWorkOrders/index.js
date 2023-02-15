import Layout from '../Layout'
import { useState } from 'react'
import { TextArea, TextInput, Button } from '../../Form'
import ControlledRadio from '../Components/ControlledRadio'
import DatePicker from '../../Form/DatePicker'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import SuccessMessage from '../Components/SuccessMessage'
import { Dialog } from '@reach/dialog'
import {
  dateIsInFuture,
  formatInvalidWorkOrderReferencesError,
  formatWorkOrderReferences,
  getInvalidWorkOrderReferences,
} from './utils'

const radioOptions = [
  {
    text: 'Cancelled - (eg. out of time)',
    value: 'Cancelled',
  },
  {
    text: 'Completed - (close to base)',
    value: 'CloseToBase',
  },
]

const CloseWorkOrders = () => {
  const [selectedOption, setSelectedOption] = useState(radioOptions[0].value)
  const [reasonToClose, setReasonToClose] = useState('')
  const [closedDate, setClosedDate] = useState('')
  const [workOrderReferences, setWorkOrderReferences] = useState('')
  const [errors, setErrors] = useState({})

  const [loading, setLoading] = useState(false)
  const [requestError, setRequestError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)

  const [showDialog, setShowDialog] = useState(false)

  const clearForm = () => {
    setReasonToClose('')
    setClosedDate('')
    setWorkOrderReferences('')
    setErrors({})
  }

  const closeToBaseSelected = () => {
    return selectedOption === 'CloseToBase'
  }

  const validateRequest = () => {
    let newErrors = {}

    if (!selectedOption) {
      newErrors.selectedOption = 'Please select an option'
    }

    if (!reasonToClose) {
      newErrors.reasonToClose = 'Please enter a reason to close'
    }

    if (!closedDate && closeToBaseSelected()) {
      newErrors.closedDate = 'Please enter a closed date'
    } else if (
      dateIsInFuture(Date.parse(closedDate)) &&
      closeToBaseSelected()
    ) {
      newErrors.closedDate = 'The closed date cannot be in the future'
    }

    const strippedWorkOrderReferences = formatWorkOrderReferences(
      workOrderReferences
    )
    const invalidWorkOrderReferences = getInvalidWorkOrderReferences(
      strippedWorkOrderReferences
    )

    if (strippedWorkOrderReferences.length === 0) {
      newErrors.workOrderReferences = 'Please enter workOrder references'
    } else if (invalidWorkOrderReferences.length > 0) {
      newErrors.workOrderReferences = formatInvalidWorkOrderReferencesError(
        invalidWorkOrderReferences
      )
    }

    return newErrors
  }

  const renderConfirmationModal = () => {
    if (showDialog) {
      return (
        <Dialog
          title="Are you sure?"
          isOpen={showDialog}
          onDismiss={() => setShowDialog(false)}
        >
          <h3 className="lbh-heading-h3">
            Are you sure you want to change the status of the following Work
            Orders to "
            {selectedOption == 'CloseToBase' ? 'Completed' : 'Cancelled'}"?
          </h3>
          <p className="lbh-body">{workOrderReferences}</p>

          <div className="lbh-dialog__actions">
            <a href="#" className="govuk-button lbh-button" onClick={submit}>
              Confirm
            </a>

            <button
              onClick={() => setShowDialog(false)}
              className="lbh-link lbh-link--no-visited-state"
            >
              Cancel
            </button>
          </div>
        </Dialog>
      )
    }
  }

  const validateForm = (event) => {
    event.preventDefault()

    if (loading) return

    const newErrors = validateRequest()
    setErrors(newErrors)
    setRequestError(null)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setShowDialog(!showDialog)
  }

  const submit = () => {
    const formatted = formatWorkOrderReferences(workOrderReferences)

    const body = {
      reason: reasonToClose,
      completionDate: closedDate,
      workOrderReferences: formatted,
    }

    if (closeToBaseSelected()) body.completionDate = closedDate

    let url = `/api/backOffice/bulk-close/${
      closeToBaseSelected() ? 'close-to-base' : 'cancel'
    }`

    setLoading(true)

    frontEndApiRequest({
      method: 'post',
      path: url,
      requestData: body,
    })
      .then(() => {
        setFormSuccess(true)
        clearForm()
      })
      .catch((err) => {
        console.error(err)
        setRequestError(err.message)
      })
      .finally(() => {
        setLoading(false)
        setShowDialog(false)
      })
  }

  return (
    <Layout title="Bulk-close Work Orders">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {formSuccess ? (
            <div>
              <SuccessMessage title="Work Orders cancelled" />
              <p>
                <a
                  data-test="closeMoreButton"
                  className="lbh-link"
                  role="button"
                  onClick={() => setFormSuccess(null)}
                >
                  Bulk-close more Work Orders
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={validateForm}>
              {requestError && <ErrorMessage label={requestError} />}

              {renderConfirmationModal()}

              <div>
                <ControlledRadio
                  label="Select reason for closing"
                  name="selectedOption"
                  options={radioOptions}
                  onChange={(event) => setSelectedOption(event.target.value)}
                  selectedOption={selectedOption}
                  error={
                    errors.selectedOption && { message: errors.selectedOption }
                  }
                />
              </div>

              <div>
                <TextInput
                  label="Reason to Close"
                  placeholder="eg. Closed - completed - requested by S Roche"
                  value={reasonToClose}
                  data-test="reasonToClose"
                  onChange={(event) => setReasonToClose(event.target.value)}
                  error={
                    errors.reasonToClose && { message: errors.reasonToClose }
                  }
                />
              </div>

              {selectedOption === 'CloseToBase' && (
                <div>
                  <DatePicker
                    name="ClosedDate"
                    label="Closed Date"
                    value={closedDate}
                    onChange={(event) => setClosedDate(event.target.value)}
                    defaultValue={new Date()}
                    labelSize="s"
                    error={errors.closedDate && { message: errors.closedDate }}
                  />
                </div>
              )}

              <div>
                <TextArea
                  label="Work Order References"
                  data-test="workOrderReferences"
                  placeholder="10008088&#10;10024867&#10;10000782"
                  value={workOrderReferences}
                  onChange={(event) =>
                    setWorkOrderReferences(event.target.value)
                  }
                  error={
                    errors.workOrderReferences && {
                      message: errors.workOrderReferences,
                    }
                  }
                />
              </div>

              <div>
                <Button
                  data-test="submit-button"
                  label="Close Work Orders"
                  type="submit"
                />
              </div>
            </form>
          )}
        </>
      )}
    </Layout>
  )
}

export default CloseWorkOrders
